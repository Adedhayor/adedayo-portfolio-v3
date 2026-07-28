// ============================================================
// Frost finish — inspired by Paper Shaders' FlutedGlass, masked to
// the glyphs. The "glass" family: vertical ribs of alternating
// highlight/shadow refracting a drifting backdrop, unlike anything
// else in the set (every other finish is a self-lit surface; this
// one reads as something seen *through*). Loosely ported from
//   node_modules/@paper-design/shaders/dist/shaders/fluted-glass.js
// This one departs further from its source than the other library
// ports: the original refracts a supplied photo (u_image) through a
// ~300-line system of margins/frames/a 50-tap Gaussian blur built for
// arbitrary rectangular crops — none of which applies to a small
// masked-text canvas with no photo behind it. What's kept is the
// actual "glass" mechanic — the rotated rib coordinate, its
// highlight/shadow banding (`smoothFract`, `pow(x, 1.3)`) — and the
// image sample is replaced with a small procedural backdrop gradient
// that drifts over time, so the ribs have something to refract.
// Margins, frame fade, blur, and grain are dropped outright rather
// than faked.
// ============================================================
import type { Finish } from './types'

// prettier-ignore
const FRAG = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2  u_res;
uniform sampler2D u_mask;

uniform vec3  u_colorBack1;
uniform vec3  u_colorBack2;
uniform vec3  u_colorHighlight;
uniform vec3  u_colorShadow;
uniform float u_size;
uniform float u_shadows;
uniform float u_highlights;
uniform float u_angle;

out vec4 fragColor;

#define PI 3.14159265358979323846

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float smoothFract(float x) {
  float f = fract(x);
  float w = fwidth(x);
  float edge = abs(f - 0.5) - 0.5;
  float band = smoothstep(-w, w, edge);
  return mix(f, 1.0 - f, band);
}

void main() {
  vec2 screenUV = gl_FragCoord.xy / u_res;
  float mA = texture(u_mask, vec2(screenUV.x, 1.0 - screenUV.y)).a;
  if (mA < 0.01) discard;

  float aspect = u_res.x / u_res.y;
  float patternRotation = -u_angle * PI / 180.;
  float patternSize = mix(200., 5., u_size);

  vec2 uv = screenUV - .5;
  uv *= patternSize;
  uv.x *= aspect;
  uv = rotate(uv, patternRotation);
  uv.x /= aspect;

  float x = smoothFract(uv.x);
  float xNonSmooth = fract(uv.x) + .0001;

  float highlightsWidth = 2. * max(.001, fwidth(uv.x));
  float highlights = smoothstep(0., highlightsWidth, xNonSmooth);
  highlights *= smoothstep(1., 1. - highlightsWidth, xNonSmooth);
  highlights = 1. - highlights;
  highlights *= u_highlights;
  highlights = clamp(highlights, 0., 1.);

  float shadows = pow(x, 1.3);
  shadows = min(shadows, 1.);
  shadows *= pow(u_shadows, 2.);
  shadows = clamp(shadows, 0., 1.);

  // Procedural backdrop standing in for the original's photo — the
  // ribs refract this instead of an image.
  float phase = screenUV.y * 2.4 + .2 * sin(xNonSmooth * 6.2831 + u_time * .3) + u_time * .06;
  vec3 backdrop = mix(u_colorBack1, u_colorBack2, .5 + .5 * sin(phase * PI));

  vec3 color = backdrop;
  color = mix(color, u_colorShadow, .55 * shadows);
  color += .5 * pow(shadows, .5) * u_colorShadow;
  color = mix(color, u_colorHighlight, highlights);

  fragColor = vec4(color, mA);
}
`

export const frostFinish: Finish = {
  id: 'frost-glass',
  label: 'Frost',
  frag: FRAG,
  cssFallback: 'wordmark-metal wordmark-metal--holo',
  setStatic: (gl, prog) => {
    gl.uniform3f(gl.getUniformLocation(prog, 'u_colorBack1'), 0.792, 0.898, 1.0) // #cae5ff pale sky
    gl.uniform3f(gl.getUniformLocation(prog, 'u_colorBack2'), 0.988, 0.988, 1.0) // #fcfcff near-white
    gl.uniform3f(gl.getUniformLocation(prog, 'u_colorHighlight'), 1.0, 1.0, 1.0)
    gl.uniform3f(gl.getUniformLocation(prog, 'u_colorShadow'), 0.451, 0.573, 0.702) // #7392b3 cool grey-blue
    gl.uniform1f(gl.getUniformLocation(prog, 'u_size'), 0.62)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_shadows'), 0.85)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_highlights'), 0.9)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_angle'), 8)
  },
}
