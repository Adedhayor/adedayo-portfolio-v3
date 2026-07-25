// ============================================================
// Litho finish — Paper Shaders' HalftoneDots, masked to the glyphs.
// The "print" family: a rotating dot-screen, the only finish in the
// set that's flat/graphic rather than liquid or lit. Ported from
//   node_modules/@paper-design/shaders/dist/shaders/halftone-dots.js
// Changes vs the original: the source shader screens a photo
// (u_image) into dots sized by per-pixel luminance — we have no
// photo, so it screens our own glyph mask instead: each dot's size
// comes from `1 - mask.a` at that cell (inside the glyph → big dots,
// outside → none), which is why u_originalColors and the RGB-sampling
// half of `getLumAtPx` are dropped — there's no colour in the mask to
// preserve, only coverage. Grain (u_grainMixer/u_grainOverlay) and
// the gooey/holes/soft dot types are dropped for the same "nothing
// to add" reason; "classic" circular dots are kept. The screen has no
// u_time term in the original (static pattern) — added here as a slow
// rotation of the dot grid, which is a real print technique (screen
// angle) so it fits the effect's own logic.
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
uniform float u_radius;
uniform float u_size;
uniform float u_rotationSpeed;

out vec4 fragColor;

mat2 rot(float a) { return mat2(cos(a), sin(a), -sin(a), cos(a)); }

float getCircle(vec2 uv, float r, float baseR) {
  r = mix(.25 * baseR, 0., r);
  float d = length(uv - .5);
  float aa = fwidth(d);
  return 1. - smoothstep(r - aa, r + aa, d);
}

float getCell(vec2 uv) {
  float insideX = step(0.0, uv.x) * (1.0 - step(1.0, uv.x));
  float insideY = step(0.0, uv.y) * (1.0 - step(1.0, uv.y));
  return insideX * insideY;
}

float getUvFrame(vec2 uv, vec2 pad) {
  float aa = 0.0001;
  float left   = smoothstep(-pad.x, -pad.x + aa, uv.x);
  float right  = smoothstep(1.0 + pad.x, 1.0 + pad.x - aa, uv.x);
  float bottom = smoothstep(-pad.y, -pad.y + aa, uv.y);
  float top    = smoothstep(1.0 + pad.y, 1.0 + pad.y - aa, uv.y);
  return left * right * bottom * top;
}

float getLumBall(vec2 p, vec2 pad, vec2 inCellOffset, float baseR, float stepSize) {
  p += inCellOffset;
  vec2 uv_i = floor(p);
  vec2 uv_f = fract(p);
  vec2 samplingUV = (uv_i + .5 - inCellOffset) * pad + vec2(.5);
  float outOfFrame = getUvFrame(samplingUV, pad * stepSize);

  float lum = 1.0 - texture(u_mask, vec2(samplingUV.x, 1.0 - samplingUV.y)).a;
  return getCircle(uv_f, lum, baseR) * outOfFrame;
}

void main() {
  vec2 screenUV = gl_FragCoord.xy / u_res;
  float mA = texture(u_mask, vec2(screenUV.x, 1.0 - screenUV.y)).a;
  if (mA < 0.01) discard;

  vec2 center = vec2(0.5);
  vec2 rotated = rot(u_rotationSpeed * u_time) * (screenUV - center) + center;

  float cellsPerSide = mix(300., 7., pow(u_size, .7)) / 2.;
  float cellSizeY = 1. / cellsPerSide;
  vec2 pad = cellSizeY * vec2(u_res.y / u_res.x, 1.);

  vec2 uv = (rotated - vec2(.5)) / pad;

  float totalShape = 0.;
  float stepSize = 0.5;
  for (float x = -0.5; x < 0.5; x += stepSize) {
    for (float y = -0.5; y < 0.5; y += stepSize) {
      totalShape += getLumBall(uv, pad, vec2(x, y), u_radius, stepSize);
    }
  }

  float finalShape = min(1., totalShape);
  vec3 color = mix(u_colorBack, u_colorFront, finalShape);

  fragColor = vec4(color, mA);
}
`

export const lithoFinish: Finish = {
  id: 'litho-halftone',
  label: 'Litho',
  frag: FRAG,
  cssFallback: 'wordmark-metal wordmark-metal--chrome',
  setStatic: (gl, prog) => {
    gl.uniform3f(gl.getUniformLocation(prog, 'u_colorFront'), 1.0, 0.29, 0.16) // #ff4a29 press red
    gl.uniform3f(gl.getUniformLocation(prog, 'u_colorBack'), 0.05, 0.05, 0.06)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_radius'), 0.15)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_size'), 0.35)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_rotationSpeed'), 0.05)
  },
}
