// ============================================================
// Plasma finish — Paper Shaders' Warp, masked to the glyphs. The
// "energy" family: swirled colour stripes, warped by layered domain
// noise rather than the paper family's fbm light-sheets or the metal
// families' bands. Ported from
//   node_modules/@paper-design/shaders/dist/shaders/warp.js
// Changes vs the original: v_patternUV (their tiling/pattern varying)
// → our own aspect-corrected UV; final alpha comes from the glyph
// mask (stop alphas forced to 1); the "checks" and "edge" shape modes
// are dropped, keeping only "stripes" — the one that reads as
// flowing ribbons once swirled, rather than a moiré grid or a hard
// gradient. Everything else — the two-noise domain warp, the swirl
// loop, the colour stepping — is untouched.
// ============================================================
import type { Finish } from './types'
import { loadNoiseTexture } from './noiseTexture'

const MAX_COLORS = 6

// prettier-ignore
const FRAG = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2  u_res;
uniform sampler2D u_mask;
uniform sampler2D u_noiseTexture;

uniform vec4  u_colors[${MAX_COLORS}];
uniform float u_colorsCount;
uniform float u_softness;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;

out vec4 fragColor;

#define TWO_PI 6.28318530718

float randomG(vec2 p) {
  vec2 uv = floor(p) / 100. + .5;
  return texture(u_noiseTexture, fract(uv)).g;
}
float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = randomG(i);
  float b = randomG(i + vec2(1.0, 0.0));
  float c = randomG(i + vec2(0.0, 1.0));
  float d = randomG(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

void main() {
  vec2 screenUV = gl_FragCoord.xy / u_res;
  float mA = texture(u_mask, vec2(screenUV.x, 1.0 - screenUV.y)).a;
  if (mA < 0.01) discard;

  vec2 uv = screenUV - 0.5;
  uv.x *= u_res.x / u_res.y;
  uv *= 1.4;

  const float firstFrameOffset = 118.;
  float t = 0.0625 * (u_time + firstFrameOffset);

  float n1 = valueNoise(uv * 1. + t);
  float n2 = valueNoise(uv * 2. - t);
  float angle = n1 * TWO_PI;
  uv.x += 4. * u_distortion * n2 * cos(angle);
  uv.y += 4. * u_distortion * n2 * sin(angle);

  float swirl = u_swirl;
  for (int i = 1; i <= 20; i++) {
    if (i >= int(u_swirlIterations)) break;
    float iFloat = float(i);
    uv.x += swirl / iFloat * cos(t + iFloat * 1.5 * uv.y);
    uv.y += swirl / iFloat * cos(t + iFloat * 1. * uv.x);
  }

  // "stripes" shape only — reads as ribbons once swirled, unlike
  // "checks" (moiré at text scale) or "edge" (just a hard gradient).
  vec2 stripesUV = uv * (2. * u_shapeScale);
  float f = fract(stripesUV.y);
  float shape = smoothstep(.0, .55, f) * (1.0 - smoothstep(.45, 1., f));

  float mixer = shape * (u_colorsCount - 1.);
  vec4 gradient = u_colors[0];
  float aa = fwidth(shape);
  for (int i = 1; i < ${MAX_COLORS}; i++) {
    if (i >= int(u_colorsCount)) break;
    float m = clamp(mixer - float(i - 1), 0.0, 1.0);
    float localMixerStart = floor(m);
    float softness = .5 * u_softness + fwidth(m);
    float smoothed = smoothstep(max(0., .5 - softness - aa), min(1., .5 + softness + aa), m - localMixerStart);
    float stepped = localMixerStart + smoothed;
    m = mix(stepped, m, u_softness);
    gradient = mix(gradient, u_colors[i], m);
  }

  fragColor = vec4(gradient.rgb, mA);
}
`

// Molten cyan → magenta → amber energy ribbons.
const COLORS: number[] = [
  0.043, 0.020, 0.098, // #0b0519 near-black violet
  0.078, 0.906, 0.851, // #14e7d9 cyan
  0.906, 0.157, 0.706, // #e728b4 magenta
  1.000, 0.678, 0.161, // #ffad29 amber
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

export const plasmaFinish: Finish = {
  id: 'plasma-warp',
  label: 'Plasma',
  frag: FRAG,
  cssFallback: 'wordmark-metal wordmark-metal--holo',
  setStatic: (gl, prog) => {
    gl.uniform4fv(gl.getUniformLocation(prog, 'u_colors'), colors)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_colorsCount'), colorsCount)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_softness'), 0.3)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_shapeScale'), 1.2)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_distortion'), 0.35)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_swirl'), 0.5)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_swirlIterations'), 6)
    loadNoiseTexture(gl, prog)
  },
}
