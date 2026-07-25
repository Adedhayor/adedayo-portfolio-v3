// ============================================================
// Liquid-metal finish — the original ChromaticMetal shader, moved
// here and up-ported to GLSL ES 3.00 (texture2D→texture,
// gl_FragColor→out). One shader, six palettes; each palette is its
// own registry entry. molten/aqua/oil-slick colour DNA is voiced
// from the Effects Studio shader gallery.
// ============================================================
import type { Finish } from './types'

// prettier-ignore
const FRAG = `#version 300 es
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform sampler2D u_mask;
uniform vec3  u_stops[8];
uniform float u_pos[8];
out vec4 fragColor;

const float TIME_SCALE = 0.4;   // <1 keeps it molten, not busy
const float SCALE   = 1.1;
const float ANGLE   = -0.35;
const float STRETCH = 1.6;
const float DEPTH   = 0.34;
const float ROUGH   = 0.55;
const float SPLIT   = 0.05;     // rgb split, in ramp space

/* Sharp colour ramp so it reads as metal, not a soft gradient. */
vec3 ramp(float x) {
  float t = fract(x);
  vec3 c = u_stops[0];
  for (int i = 1; i < 8; i++) {
    float p0 = u_pos[i - 1];
    float p1 = u_pos[i];
    float e = max((p1 - p0) * 0.35, 0.004);
    c = mix(c, u_stops[i], smoothstep(p1 - e, p1, t));
  }
  return c;
}

/* Repeating band coordinate with a periodic domain warp — the
   "liquid" flow. Time terms are sin/cos so the loop is seamless. */
float bands(vec2 uv, float t) {
  vec2 p = uv - 0.5;
  p.x *= u_res.x / u_res.y;
  float ca = cos(ANGLE), sa = sin(ANGLE);
  p = mat2(ca, -sa, sa, ca) * p;
  p.y /= STRETCH;
  float w = sin(p.y * 9.0  + sin(t * 0.9) * 2.0) * DEPTH
          + sin(p.y * 23.0 - cos(t * 0.6) * 2.0) * DEPTH * ROUGH
          + sin(p.x * 4.0  + sin(t * 0.5) * 3.0) * DEPTH * 0.6;
  return p.x * SCALE + w + t * 0.12;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float a = texture(u_mask, vec2(uv.x, 1.0 - uv.y)).a;
  if (a < 0.01) discard;
  float x = bands(uv, u_time * TIME_SCALE);
  /* Sample the ramp 3× at offset coords — one per channel — for the
     red/blue fringes along band edges. */
  vec3 col = vec3(ramp(x + SPLIT).r, ramp(x).g, ramp(x - SPLIT).b);
  fragColor = vec4(col, a);
}
`

const POSITIONS = [0.0, 0.16, 0.34, 0.5, 0.64, 0.78, 0.92, 1.0]

// 8 stops each, alternating dark valleys / bright crests so the bands
// stay sharp. Keep crest red low on cool finishes or the rgb-split
// washes them to white.
// prettier-ignore
export const PALETTES: Record<string, number[]> = {
  chrome: [
    0.04, 0.04, 0.04,   0.97, 0.97, 0.95,   0.11, 0.11, 0.11,   1.00, 1.00, 1.00,
    0.54, 0.54, 0.54,   0.06, 0.06, 0.06,   0.94, 0.94, 0.91,   0.04, 0.04, 0.04,
  ],
  gold: [
    0.10, 0.07, 0.02,   0.97, 0.92, 0.72,   0.42, 0.29, 0.07,   1.00, 0.97, 0.90,
    0.66, 0.50, 0.18,   0.08, 0.05, 0.02,   0.95, 0.87, 0.62,   0.10, 0.07, 0.02,
  ],
  holo: [
    0.56, 0.61, 1.00,   1.00, 0.83, 0.94,   0.08, 0.08, 0.16,   0.72, 1.00, 0.88,
    1.00, 0.96, 0.72,   0.63, 0.85, 1.00,   0.89, 0.72, 1.00,   0.56, 0.61, 1.00,
  ],
  molten: [
    0.07, 0.02, 0.02,   1.00, 0.44, 0.14,   0.24, 0.04, 0.02,   1.00, 0.82, 0.50,
    0.60, 0.14, 0.04,   0.05, 0.02, 0.02,   0.94, 0.28, 0.09,   0.07, 0.02, 0.02,
  ],
  aqua: [
    0.01, 0.05, 0.08,   0.52, 0.92, 1.00,   0.02, 0.11, 0.17,   0.30, 0.82, 1.00,
    0.10, 0.40, 0.52,   0.01, 0.05, 0.08,   0.62, 0.95, 1.00,   0.01, 0.05, 0.08,
  ],
  oilslick: [
    0.03, 0.03, 0.09,   0.36, 0.55, 1.00,   0.08, 0.04, 0.13,   0.20, 0.86, 1.00,
    0.34, 0.14, 0.42,   0.05, 0.02, 0.08,   1.00, 0.34, 0.48,   0.03, 0.03, 0.09,
  ],
}

/* Build a liquid-metal finish for a given palette key. */
export function liquidMetalFinish(id: string, label: string, palette: keyof typeof PALETTES): Finish {
  const stops = PALETTES[palette]
  return {
    id,
    label,
    frag: FRAG,
    cssFallback: `wordmark-metal wordmark-metal--${palette}`,
    setStatic: (gl, prog) => {
      gl.uniform3fv(gl.getUniformLocation(prog, 'u_stops'), stops)
      gl.uniform1fv(gl.getUniformLocation(prog, 'u_pos'), POSITIONS)
    },
  }
}
