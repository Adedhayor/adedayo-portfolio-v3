// ============================================================
// Vapor finish — Paper Shaders' SmokeRing, masked to the glyphs. The
// "smoke" family: a drifting fbm cloud field colouring a gradient,
// softer and mistier than the paper family's lit fbm light-sheets.
// Ported from
//   node_modules/@paper-design/shaders/dist/shaders/smoke-ring.js
// Changes vs the original: the source shader traces a literal ring
// (`getRingShape`, gated by u_radius/u_thickness) — right for a
// standalone circular effect, but a ring band doesn't fill arbitrary
// glyph outlines, so it's dropped entirely. What's kept is the actual
// "smoke" — the polar-warped two-octave fbm (`getNoise`) driving the
// colour gradient — now sampled straight from the glyph mask's UV
// instead of gated by ring distance. Final alpha comes from the mask.
// ============================================================
import type { Finish } from './types'
import { loadNoiseTexture } from './noiseTexture'

const MAX_COLORS = 6
const MAX_NOISE_ITER = 8

// prettier-ignore
const FRAG = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2  u_res;
uniform sampler2D u_mask;
uniform sampler2D u_noiseTexture;

uniform vec4  u_colors[${MAX_COLORS}];
uniform float u_colorsCount;
uniform float u_noiseScale;
uniform float u_noiseIterations;

out vec4 fragColor;

#define TWO_PI 6.28318530718

float randomR(vec2 p) {
  vec2 uv = floor(p) / 100. + .5;
  return texture(u_noiseTexture, fract(uv)).r;
}
float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = randomR(i);
  float b = randomR(i + vec2(1.0, 0.0));
  float c = randomR(i + vec2(0.0, 1.0));
  float d = randomR(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}
vec2 fbm(vec2 n0, vec2 n1) {
  vec2 total = vec2(0.0);
  float amplitude = .4;
  for (int i = 0; i < ${MAX_NOISE_ITER}; i++) {
    if (i >= int(u_noiseIterations)) break;
    total.x += valueNoise(n0) * amplitude;
    total.y += valueNoise(n1) * amplitude;
    n0 *= 1.99;
    n1 *= 1.99;
    amplitude *= 0.65;
  }
  return total;
}

float getNoise(vec2 uv, vec2 pUv, float t) {
  vec2 pUvLeft = pUv + .03 * t;
  float period = max(abs(u_noiseScale * TWO_PI), 1e-6);
  vec2 pUvRight = vec2(fract(pUv.x / period) * period, pUv.y) + .03 * t;
  vec2 noise = fbm(pUvLeft, pUvRight);
  return mix(noise.y, noise.x, smoothstep(-.25, .25, uv.x));
}

void main() {
  vec2 screenUV = gl_FragCoord.xy / u_res;
  float mA = texture(u_mask, vec2(screenUV.x, 1.0 - screenUV.y)).a;
  if (mA < 0.01) discard;

  vec2 shape_uv = screenUV - 0.5;
  shape_uv.x *= u_res.x / u_res.y;
  shape_uv *= 2.4;

  float t = u_time;
  float cycleDuration = 3.;
  float period2 = 2.0 * cycleDuration;
  float localTime1 = fract((0.1 * t + cycleDuration) / period2) * period2;
  float localTime2 = fract((0.1 * t) / period2) * period2;
  float timeBlend = .5 + .5 * sin(.1 * t * 3.14159265 / cycleDuration - .5 * 3.14159265);

  float atg = atan(shape_uv.y, shape_uv.x) + .001;
  float l = length(shape_uv);
  float radialOffset = .5 * l - inversesqrt(max(1e-4, l));
  vec2 polar_uv1 = vec2(atg, localTime1 - radialOffset) * u_noiseScale;
  vec2 polar_uv2 = vec2(atg, localTime2 - radialOffset) * u_noiseScale;

  float noise1 = getNoise(shape_uv, polar_uv1, t);
  float noise2 = getNoise(shape_uv, polar_uv2, t);
  float noise = mix(noise1, noise2, timeBlend);

  float mixer = clamp(noise, 0., 1.) * (u_colorsCount - 1.);
  int idxLast = int(u_colorsCount) - 1;
  vec3 gradient = u_colors[idxLast].rgb;
  for (int i = ${MAX_COLORS} - 2; i >= 0; i--) {
    float localT = clamp(mixer - float(idxLast - i - 1), 0., 1.);
    gradient = mix(gradient, u_colors[i].rgb, localT);
  }

  fragColor = vec4(gradient, mA);
}
`

// Pale mist → smoke → charcoal.
const COLORS: number[] = [
  0.929, 0.925, 0.937, // #ededef pale mist
  0.694, 0.706, 0.741, // #b1b4bd smoke grey
  0.396, 0.408, 0.451, // #656873 slate
  0.161, 0.165, 0.192, // #292a31 charcoal
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

export const vaporFinish: Finish = {
  id: 'vapor-smoke',
  label: 'Vapor',
  frag: FRAG,
  cssFallback: 'wordmark-metal wordmark-metal--chrome',
  setStatic: (gl, prog) => {
    gl.uniform4fv(gl.getUniformLocation(prog, 'u_colors'), colors)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_colorsCount'), colorsCount)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_noiseScale'), 1.3)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_noiseIterations'), 6)
    loadNoiseTexture(gl, prog)
  },
}
