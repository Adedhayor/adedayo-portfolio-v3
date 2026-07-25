// ============================================================
// Tide finish — Paper Shaders' Waves, masked to the glyphs. The
// "water" family: crisp horizontal ripple bands, the simplest
// mechanic of the set and a deliberate contrast to every other
// finish's soft/organic fields. Ported from
//   node_modules/@paper-design/shaders/dist/shaders/waves.js
// Changes vs the original: v_patternUV → our own aspect-corrected UV;
// the source shader has no u_time term at all (it's a static tiling
// pattern in the library's gallery) — motion is added here by
// scrolling the phase with u_time, since every other finish in this
// set animates. Final alpha comes from the glyph mask, colours are
// forced to full alpha so the front/back blend is just the two flat
// colours the original already computes.
// ============================================================
import type { Finish } from './types'

// prettier-ignore
const FRAG = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2  u_res;
uniform sampler2D u_mask;

uniform vec3  u_colorFront;
uniform vec3  u_colorBack;
uniform float u_frequency;
uniform float u_amplitude;
uniform float u_spacing;
uniform float u_proportion;
uniform float u_softness;
uniform float u_speed;

out vec4 fragColor;

#define TWO_PI 6.28318530718

void main() {
  vec2 screenUV = gl_FragCoord.xy / u_res;
  float mA = texture(u_mask, vec2(screenUV.x, 1.0 - screenUV.y)).a;
  if (mA < 0.01) discard;

  vec2 uv = screenUV - 0.5;
  uv.x *= u_res.x / u_res.y;
  vec2 shape_uv = uv * 4.;
  shape_uv.x += u_speed * u_time;

  float irregular2 = .75 * (sin(shape_uv.x * u_frequency * TWO_PI) + .5 * cos(shape_uv.x * .5 * u_frequency * TWO_PI));
  float offset = irregular2 * 2. * u_amplitude;

  float spacing = (.001 + u_spacing);
  float shape = .5 + .5 * sin((shape_uv.y + offset) * 3.14159265 / spacing);

  float aa = .0001 + fwidth(shape);
  float dc = 1. - clamp(u_proportion, 0., 1.);
  float e0 = dc - u_softness - aa;
  float e1 = dc + u_softness + aa;
  float res = smoothstep(min(e0, e1), max(e0, e1), shape);

  vec3 color = mix(u_colorBack, u_colorFront, res);

  fragColor = vec4(color, mA);
}
`

export const tideFinish: Finish = {
  id: 'tide-waves',
  label: 'Tide',
  frag: FRAG,
  cssFallback: 'wordmark-metal wordmark-metal--holo',
  setStatic: (gl, prog) => {
    // Deep sea → foam, front/back reversed from a "shape" fill so the
    // ripple bands themselves carry the colour, not a background.
    gl.uniform3f(gl.getUniformLocation(prog, 'u_colorFront'), 0.867, 0.949, 1.0) // #ddf2ff foam
    gl.uniform3f(gl.getUniformLocation(prog, 'u_colorBack'), 0.043, 0.157, 0.263) // #0b2843 deep sea
    gl.uniform1f(gl.getUniformLocation(prog, 'u_frequency'), 1.4)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_amplitude'), 0.6)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_spacing'), 0.22)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_proportion'), 0.5)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_softness'), 0.12)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_speed'), 0.12)
  },
}
