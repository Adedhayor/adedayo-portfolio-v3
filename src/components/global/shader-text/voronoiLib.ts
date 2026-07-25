// ============================================================
// Quartz finish — Paper Shaders' Voronoi, masked to the glyphs. The
// "cellular" family: a jittered cell mosaic with glowing seams, a
// mechanic none of our other finishes have (they're all continuous
// fields — this one is discrete facets). Ported from
//   node_modules/@paper-design/shaders/dist/shaders/voronoi.js
// Changes vs the original: v_patternUV → our own aspect-corrected UV;
// final alpha comes from the glyph mask instead of the cell/gap
// colour-alpha blend (stop + gap/glow alphas forced to 1, mask alpha
// used for the final composite). The voronoi distance field, jitter,
// and glow math are untouched.
// ============================================================
import type { Finish } from './types'
import { loadNoiseTexture } from './noiseTexture'

const MAX_COLORS = 5

// prettier-ignore
const FRAG = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2  u_res;
uniform sampler2D u_mask;
uniform sampler2D u_noiseTexture;

uniform vec4  u_colors[${MAX_COLORS}];
uniform float u_colorsCount;
uniform float u_scale;
uniform float u_stepsPerColor;
uniform vec3  u_colorGlow;
uniform vec3  u_colorGap;
uniform float u_distortion;
uniform float u_gap;
uniform float u_glow;

out vec4 fragColor;

#define TWO_PI 6.28318530718

vec2 randomGB(vec2 p) {
  vec2 uv = floor(p) / 100. + .5;
  return texture(u_noiseTexture, fract(uv)).gb;
}

vec4 voronoi(vec2 x, float t) {
  vec2 ip = floor(x);
  vec2 fp = fract(x);

  vec2 mg, mr;
  float md = 8.;
  float rand = 0.;

  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = randomGB(ip + g);
      float raw_hash = o.x;
      o = .5 + u_distortion * sin(t + TWO_PI * o);
      vec2 r = g + o - fp;
      float d = dot(r, r);
      if (d < md) { md = d; mr = r; mg = g; rand = raw_hash; }
    }
  }

  md = 8.;
  for (int j = -2; j <= 2; j++) {
    for (int i = -2; i <= 2; i++) {
      vec2 g = mg + vec2(float(i), float(j));
      vec2 o = randomGB(ip + g);
      o = .5 + u_distortion * sin(t + TWO_PI * o);
      vec2 r = g + o - fp;
      if (dot(mr - r, mr - r) > .00001) {
        md = min(md, dot(.5 * (mr + r), normalize(r - mr)));
      }
    }
  }

  return vec4(md, mr, rand);
}

void main() {
  vec2 screenUV = gl_FragCoord.xy / u_res;
  float mA = texture(u_mask, vec2(screenUV.x, 1.0 - screenUV.y)).a;
  if (mA < 0.01) discard;

  vec2 uv = screenUV - 0.5;
  uv.x *= u_res.x / u_res.y;
  vec2 shape_uv = uv * u_scale;

  float t = u_time;
  vec4 voronoiRes = voronoi(shape_uv, t);

  float shape = clamp(voronoiRes.w, 0., 1.);
  float mixer = (shape - .5 / u_colorsCount) * u_colorsCount;
  float steps = max(1., u_stepsPerColor);

  vec3 gradient = u_colors[0].rgb;
  for (int i = 1; i < ${MAX_COLORS}; i++) {
    if (i >= int(u_colorsCount)) break;
    float localT = clamp(mixer - float(i - 1), 0.0, 1.0);
    localT = round(localT * steps) / steps;
    gradient = mix(gradient, u_colors[i].rgb, localT);
  }

  if ((mixer < 0.) || (mixer > (u_colorsCount - 1.))) {
    float localT = mixer + 1.;
    if (mixer > (u_colorsCount - 1.)) {
      localT = mixer - (u_colorsCount - 1.);
    }
    localT = round(localT * steps) / steps;
    gradient = mix(u_colors[int(u_colorsCount - 1.)].rgb, u_colors[0].rgb, localT);
  }

  float glows = pow(length(voronoiRes.yz * u_glow), 1.5);
  vec3 color = mix(gradient, u_colorGlow, clamp(glows, 0., 1.));

  float edge = voronoiRes.x;
  float smoothEdge = .02 / (2. * u_scale) * (1. + .5 * u_gap);
  edge = smoothstep(u_gap - smoothEdge, u_gap + smoothEdge, edge);
  color = mix(u_colorGap, color, edge);

  fragColor = vec4(color, mA);
}
`

// Cool crystal facets — indigo/teal cells, cyan glow, near-black seams.
const COLORS: number[] = [
  0.043, 0.055, 0.106, // #0b0e1b indigo-black
  0.098, 0.220, 0.267, // #193844 deep teal
  0.180, 0.478, 0.510, // #2e7a82 teal
  0.522, 0.847, 0.780, // #85d8c7 mint
  0.741, 0.933, 0.910, // #bdeee8 pale crest
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

export const quartzFinish: Finish = {
  id: 'quartz-voronoi',
  label: 'Quartz',
  frag: FRAG,
  cssFallback: 'wordmark-metal wordmark-metal--chrome',
  setStatic: (gl, prog) => {
    gl.uniform4fv(gl.getUniformLocation(prog, 'u_colors'), colors)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_colorsCount'), colorsCount)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_scale'), 4.5)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_stepsPerColor'), 1)
    gl.uniform3f(gl.getUniformLocation(prog, 'u_colorGlow'), 0.435, 0.878, 1.0)
    gl.uniform3f(gl.getUniformLocation(prog, 'u_colorGap'), 0.02, 0.03, 0.04)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_distortion'), 0.3)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_gap'), 0.06)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_glow'), 0.5)
    loadNoiseTexture(gl, prog)
  },
}
