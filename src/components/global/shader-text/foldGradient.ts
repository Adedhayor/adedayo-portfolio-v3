// ============================================================
// FoldGradient finishes (Aurora / Ember / Nebula) — a genuinely
// different shader from the metal (not a palette-on-metal swap):
// Effects Studio's FoldGradient (domain-warped fbm light-sheets, lit,
// ACES-graded, dithered). Ported here from
//   ~/conductor/repos/effects-studio/components/shaders/foldGradientShader.ts
// Changes vs the original: u_resolution → u_res, and it now samples the
// glyph mask (discard + alpha out) so the light-sheets fill the
// wordmark instead of the whole canvas. GLSL ES 3.00 (needs WebGL2 —
// it uses screen-space derivatives for the crest lighting).
// ============================================================
import type { Finish } from './types'

// prettier-ignore
const FRAG = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2  u_res;
uniform sampler2D u_mask;

uniform vec4  u_colors[5];
uniform float u_ncols;
uniform vec3  u_back;       // colour of the black gaps
uniform vec3  u_shadow;     // tint that bleeds into the shadowed edges
uniform float u_softness;
uniform float u_saturation;
uniform float u_noise;
uniform float u_rotation;   // degrees
uniform float u_folds;      // "zoom" — warp scale

out vec4 fragColor;

mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }

float hash12(vec2 p){
  vec3 p3=fract(vec3(p.xyx)*0.1031);
  p3+=dot(p3, p3.yzx+33.33);
  return fract((p3.x+p3.y)*p3.z);
}
float vnoise(vec2 p){
  vec2 ip=floor(p), u=fract(p); u=u*u*(3.0-2.0*u);
  float r=mix(mix(hash12(ip),          hash12(ip+vec2(1,0)), u.x),
              mix(hash12(ip+vec2(0,1)), hash12(ip+vec2(1,1)), u.x), u.y);
  return r*r;
}
const mat2 m2=mat2(0.8,-0.6,0.6,0.8);
float fbm(vec2 p){
  float f=0.0;
  f+=0.5000*vnoise(p); p=m2*p*2.02;
  f+=0.2500*vnoise(p); p=m2*p*2.03;
  f+=0.1250*vnoise(p);
  return f/0.875;
}
float pat(vec2 p, out float hue){
  vec2 q=vec2(fbm(p), fbm(p+vec2(5.2,1.3)));
  vec2 r=vec2(fbm(p+4.0*q+vec2(1.7,9.2)), fbm(p+4.0*q+vec2(8.3,2.8)));
  hue=clamp(r.x*0.95+0.03, 0.0, 1.0);
  r+=u_time*0.045;
  return fbm(p+1.76*r);
}
vec3 palette(float x){
  x=clamp(x,0.0,1.0)*(u_ncols-1.0);
  int i=int(floor(x)); float f=fract(x);
  return mix(u_colors[i].rgb, u_colors[min(i+1,int(u_ncols)-1)].rgb, smoothstep(0.0,1.0,f));
}
float bayer4(vec2 p){
  int m[16]=int[16](0,8,2,10, 12,4,14,6, 3,11,1,9, 15,7,13,5);
  return float(m[int(mod(p.y,4.0))*4 + int(mod(p.x,4.0))])/16.0;
}

void main(){
  vec2 uv=gl_FragCoord.xy/u_res.xy;
  // mask to the glyphs — the one change that makes this a text fill
  float mA=texture(u_mask, vec2(uv.x, 1.0-uv.y)).a;
  if(mA<0.01) discard;

  vec2 dir=normalize(vec2(0.66,0.75));
  vec2 perp=vec2(-dir.y,dir.x);
  float sm=0.045+(2.0-u_softness)*0.075;
  float jit=hash12(floor(gl_FragCoord.xy*0.5))-0.5;

  float asp=u_res.x/u_res.y;
  mat2  R=rot(radians(u_rotation));
  float zsc=29.16/u_folds;
  vec2  pBase=vec2((uv.x-0.5)*asp, uv.y-0.5)*R*zsc;
  vec2  wDir =vec2(dir.x*asp,  dir.y )*R*zsc;
  vec2  wPerp=vec2(perp.x*asp, perp.y)*R*zsc;

  vec3 L=normalize(vec3(0.55,0.35,0.55));
  vec3 HL=normalize(L+vec3(0.0,0.0,1.0));

  float lum=0.0, hue=0.0, wsum=0.0, bloom=0.0;
  const int K=6;
  for(int i=-K;i<=K;i++){
    float fi=(float(i)+jit)/float(K);
    float w=exp(-fi*fi*2.5);
    vec2 off=wDir*(fi*sm)+wPerp*(fi*sm*0.11);
    float hh; float h=pat(pBase+off, hh);
    vec2 g=vec2(dFdx(h),dFdy(h))*u_res.xy*0.0022;
    vec3 N=normalize(vec3(-g, 0.5));
    float diff=clamp(dot(N,L),0.0,1.0);
    float crest=pow(clamp(dot(N,HL),0.0,1.0),16.0);
    float ribbon=smoothstep(0.14,0.92,h);
    float lv=(ribbon*(0.34+diff*0.90)+crest*0.60)*smoothstep(0.02,0.45,h);
    lum+=lv*w; hue+=hh*w; wsum+=w;
    bloom+=smoothstep(0.55,1.0,lv)*w;
  }
  lum/=wsum; hue/=wsum; bloom/=wsum;

  vec2 qc=(uv-0.5); qc.x*=asp; lum*=1.0-dot(qc,qc)*0.45;

  vec3 grad=palette(hue*0.62 + lum*0.42);
  vec3 col=mix(u_back, u_shadow, smoothstep(0.015,0.30,lum));
  col=mix(col, grad, smoothstep(0.22,0.72,lum));
  col+=grad*bloom*0.55;

  col=clamp((col*(2.51*col+0.03))/(col*(2.43*col+0.59)+0.14),0.0,1.0);
  col=pow(col, vec3(1.0/2.2));
  float luma=dot(col, vec3(0.2126,0.7152,0.0722));
  col=clamp(mix(vec3(luma), col, u_saturation), 0.0, 1.0);

  float lvl=mix(255.0, 14.0, clamp(u_noise,0.0,1.0));
  col+=(bayer4(gl_FragCoord.xy)-0.5)/lvl;
  col=floor(col*lvl+0.5)/lvl;

  fragColor=vec4(col, mA);
}
`

// One shader, several palettes/params → distinctly-voiced satin
// finishes. FoldGradient's lit, graded output varies far more with
// palette than the metal ramp does, so these read as separate looks.
type FoldOpts = {
  colors: number[] // 5 × [r,g,b] in 0–1
  back: [number, number, number] // colour of the gaps
  shadow: [number, number, number] // tint bleeding into shadowed edges
  folds: number // "zoom" — bigger = larger sheets
  rotation: number // degrees
  saturation?: number
}

function toColors(rgb: number[]): Float32Array {
  const out = new Float32Array(20)
  for (let i = 0; i < 5; i++) {
    out[i * 4] = rgb[i * 3]
    out[i * 4 + 1] = rgb[i * 3 + 1]
    out[i * 4 + 2] = rgb[i * 3 + 2]
    out[i * 4 + 3] = 1
  }
  return out
}

function foldFinish(id: string, label: string, cssFallback: string, o: FoldOpts): Finish {
  const colors = toColors(o.colors)
  return {
    id,
    label,
    frag: FRAG,
    cssFallback,
    setStatic: (gl, prog) => {
      gl.uniform4fv(gl.getUniformLocation(prog, 'u_colors'), colors)
      gl.uniform1f(gl.getUniformLocation(prog, 'u_ncols'), 5)
      gl.uniform3f(gl.getUniformLocation(prog, 'u_back'), o.back[0], o.back[1], o.back[2])
      gl.uniform3f(gl.getUniformLocation(prog, 'u_shadow'), o.shadow[0], o.shadow[1], o.shadow[2])
      gl.uniform1f(gl.getUniformLocation(prog, 'u_softness'), 1.0)
      gl.uniform1f(gl.getUniformLocation(prog, 'u_saturation'), o.saturation ?? 1.08)
      gl.uniform1f(gl.getUniformLocation(prog, 'u_noise'), 0.0)
      gl.uniform1f(gl.getUniformLocation(prog, 'u_rotation'), o.rotation)
      gl.uniform1f(gl.getUniformLocation(prog, 'u_folds'), o.folds)
    },
  }
}

// Cool satin steel → violet.
export const auroraFinish = foldFinish('aurora-fold', 'Aurora', 'wordmark-metal wordmark-metal--aurora', {
  colors: [
    0.043, 0.063, 0.188, // #0b1030 indigo-black
    0.122, 0.435, 0.561, // #1f6f8f teal
    0.341, 0.878, 0.769, // #57e0c4 mint
    0.933, 0.957, 1.000, // #eef4ff near-white crest
    0.725, 0.549, 1.000, // #b98cff violet
  ],
  back: [0.02, 0.024, 0.06],
  shadow: [0.039, 0.11, 0.165],
  folds: 8,
  rotation: -8,
})

// Warm lava drape.
export const emberFinish = foldFinish('ember-fold', 'Ember', 'wordmark-metal wordmark-metal--ember', {
  colors: [
    0.098, 0.024, 0.008, // #190602 near-black maroon
    0.478, 0.118, 0.024, // #7a1e06 burnt umber
    1.000, 0.416, 0.118, // #ff6a1e orange
    1.000, 0.824, 0.478, // #ffd27a warm cream crest
    1.000, 0.231, 0.180, // #ff3b2e red
  ],
  back: [0.055, 0.018, 0.01],
  shadow: [0.16, 0.05, 0.03],
  folds: 7,
  rotation: 6,
  saturation: 1.12,
})

// Purple/magenta nebula.
export const nebulaFinish = foldFinish('nebula-fold', 'Nebula', 'wordmark-metal wordmark-metal--nebula', {
  colors: [
    0.039, 0.024, 0.125, // #0a0620 indigo-black
    0.227, 0.122, 0.561, // #3a1f8f deep violet
    0.561, 0.247, 1.000, // #8f3fff violet
    1.000, 0.369, 0.769, // #ff5ec4 magenta crest
    0.435, 0.878, 1.000, // #6fe0ff cyan
  ],
  back: [0.03, 0.02, 0.06],
  shadow: [0.10, 0.06, 0.18],
  folds: 9,
  rotation: -14,
  saturation: 1.1,
})
