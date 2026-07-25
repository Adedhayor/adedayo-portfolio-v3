// ============================================================
// Prism finish — Paper Shaders' MeshGradient, masked to the glyphs.
// A third family: soft inverse-distance-weighted colour blobs that
// orbit and swirl (not fbm light-sheets like the paper family, not
// banded flow like metal). Ported from
//   node_modules/@paper-design/shaders/dist/shaders/mesh-gradient.js
// Changes vs the original: v_objectUV (their sizing-system varying)
// → our own aspect-corrected UV from gl_FragCoord; final alpha comes
// from the glyph mask instead of the shader's own colour-alpha blend
// (stop alphas are forced to 1 so the two agree, and u_grainMixer —
// which only jitters blob position from a second grain sample — is
// dropped as a redundant knob). The orbiting colour positions,
// inverse-distance weighting, swirl/distortion warp, and dither grain
// are untouched.
// ============================================================
import type { Finish } from './types'

const MAX_COLORS = 6

// prettier-ignore
const FRAG = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2  u_res;
uniform sampler2D u_mask;

uniform vec4  u_colors[${MAX_COLORS}];
uniform float u_colorsCount;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_grainOverlay;

out vec4 fragColor;

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float hash21(vec2 p) {
  p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}

float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

vec2 getPosition(int i, float t) {
  float a = float(i) * .37;
  float b = .6 + fract(float(i) / 3.) * .9;
  float c = .8 + fract(float(i + 1) / 4.);
  float x = sin(t * b + a);
  float y = cos(t * c + a * 1.5);
  return .5 + .5 * vec2(x, y);
}

void main() {
  vec2 screenUV = gl_FragCoord.xy / u_res;
  float mA = texture(u_mask, vec2(screenUV.x, 1.0 - screenUV.y)).a;
  if (mA < 0.01) discard;

  // Aspect-corrected, object-centred UV — stands in for their
  // sizing-system v_objectUV so the colour blobs stay round.
  vec2 uv = screenUV - 0.5;
  uv.x *= u_res.x / u_res.y;
  uv += 0.5;

  vec2 grainUV = uv * 1000.;
  float grain = valueNoise(grainUV);

  const float firstFrameOffset = 41.5;
  float t = .5 * (u_time + firstFrameOffset);

  float radius = smoothstep(0., 1., length(uv - .5));
  float center = 1. - radius;
  for (float i = 1.; i <= 2.; i++) {
    uv.x += u_distortion * center / i * sin(t + i * .4 * smoothstep(.0, 1., uv.y)) * cos(.2 * t + i * 2.4 * smoothstep(.0, 1., uv.y));
    uv.y += u_distortion * center / i * cos(t + i * 2. * smoothstep(.0, 1., uv.x));
  }

  vec2 uvRotated = uv - vec2(.5);
  float angle = 3. * u_swirl * radius;
  uvRotated = rotate(uvRotated, -angle);
  uvRotated += vec2(.5);

  vec3 color = vec3(0.);
  float totalWeight = 0.;
  for (int i = 0; i < ${MAX_COLORS}; i++) {
    if (i >= int(u_colorsCount)) break;
    vec2 pos = getPosition(i, t);
    float dist = pow(length(uvRotated - pos), 3.5);
    float weight = 1. / (dist + 1e-3);
    color += u_colors[i].rgb * weight;
    totalWeight += weight;
  }
  color /= max(1e-4, totalWeight);

  float grainOverlay = valueNoise(rotate(grainUV, 1.) + vec2(3.));
  grainOverlay = mix(grainOverlay, valueNoise(rotate(grainUV, 2.) + vec2(-1.)), .5);
  grainOverlay = pow(grainOverlay, 1.3);
  float grainOverlayV = grainOverlay * 2. - 1.;
  vec3 grainOverlayColor = vec3(step(0., grainOverlayV));
  float grainOverlayStrength = u_grainOverlay * abs(grainOverlayV);
  grainOverlayStrength = pow(grainOverlayStrength, .8);
  color = mix(color, grainOverlayColor, .35 * grainOverlayStrength);

  fragColor = vec4(color, mA);
}
`

// Iridescent-film spectrum — indigo → mint → gold → coral → violet.
const COLORS: number[] = [
  0.051, 0.106, 0.165, // #0d1b2a deep navy
  0.239, 0.863, 0.592, // #3ddc97 mint
  0.976, 0.780, 0.310, // #f9c74f gold
  0.976, 0.255, 0.267, // #f94144 coral
  0.627, 0.424, 0.835, // #a06cd5 violet
]

function toColorsVec4(rgb: number[]): Float32Array {
  const n = rgb.length / 3
  const out = new Float32Array(MAX_COLORS * 4)
  for (let i = 0; i < n; i++) {
    out[i * 4] = rgb[i * 3]
    out[i * 4 + 1] = rgb[i * 3 + 1]
    out[i * 4 + 2] = rgb[i * 3 + 2]
    out[i * 4 + 3] = 1
  }
  return out
}

const colors = toColorsVec4(COLORS)
const colorsCount = COLORS.length / 3

export const prismFinish: Finish = {
  id: 'prism-mesh',
  label: 'Prism',
  frag: FRAG,
  cssFallback: 'wordmark-metal wordmark-metal--nebula',
  setStatic: (gl, prog) => {
    gl.uniform4fv(gl.getUniformLocation(prog, 'u_colors'), colors)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_colorsCount'), colorsCount)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_distortion'), 0.25)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_swirl'), 0.6)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_grainOverlay'), 0.06)
  },
}
