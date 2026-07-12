// ============================================================
// ChromaticMetal — WebGL liquid-chrome text for the footer
// wordmark (feedback 2026-07-12 #4/#5, ref: petermarc.com).
// Brushed-chrome bands flow like liquid metal, with chromatic
// aberration (RGB split) fringing the band edges. The shader is
// masked to the text: an invisible sizer span keeps the layout /
// responsive type, a 2D canvas rasterises the same glyphs into an
// alpha texture, and the fragment shader colors only that ink.
// Rendering rules (per spec): canvas sized from the measured
// element (ResizeObserver × devicePixelRatio, never 0×0), a
// continuous rAF loop, one frame drawn on mount, and
// getShaderInfoLog logged on compile failure. Gradient stops are
// a fixed-size uniform array walked with constant loop indices
// (WebGL1 forbids variable indexing). Seamless loop via periodic
// time terms. If WebGL is unavailable the sizer text stays
// visible with the CSS chrome class as a fallback.
// ============================================================
import { useEffect, useRef } from 'react'

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform sampler2D u_mask;
uniform vec3  u_stops[8];
uniform float u_pos[8];

const float SCALE   = 1.1;    // band repeats across the mark
const float ANGLE   = -0.35;  // band direction (radians)
const float STRETCH = 1.6;    // anisotropy along the bands
const float DEPTH   = 0.34;   // liquid warp amplitude
const float ROUGH   = 0.55;   // secondary high-freq warp
const float SPLIT   = 0.05;   // rgb split, in ramp space

/* Color ramp — sharp transitions so it reads as chrome, not a soft
   gradient. Constant loop index only (WebGL1). */
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
   "liquid" flow. All time terms are sin/cos so the loop is seamless. */
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
  float a = texture2D(u_mask, vec2(uv.x, 1.0 - uv.y)).a;
  if (a < 0.01) discard;
  float x = bands(uv, u_time);
  /* Sample the ramp 3× at offset coordinates — one per channel —
     for the red/blue/cyan/yellow fringes along band edges. */
  vec3 col = vec3(ramp(x + SPLIT).r, ramp(x).g, ramp(x - SPLIT).b);
  gl_FragColor = vec4(col, a);
}
`

/* Global speed — <1 slows the whole loop (round E #7: gradient was
   too fast; keep it molten, not busy). */
const TIME_SCALE = 0.4

/* Palettes — 8 stops each, alternating dark/light so the bands stay
   sharp. Cycled by the footer easter egg; port these to the effects
   studio when the shader moves there. */
// prettier-ignore
const PALETTES = {
  chrome: {
    stops: [
      0.04, 0.04, 0.04,   0.97, 0.97, 0.95,   0.11, 0.11, 0.11,   1.00, 1.00, 1.00,
      0.54, 0.54, 0.54,   0.06, 0.06, 0.06,   0.94, 0.94, 0.91,   0.04, 0.04, 0.04,
    ],
    fallbackCls: 'wordmark-metal wordmark-metal--chrome',
  },
  gold: {
    stops: [
      0.10, 0.07, 0.02,   0.97, 0.92, 0.72,   0.42, 0.29, 0.07,   1.00, 0.97, 0.90,
      0.66, 0.50, 0.18,   0.08, 0.05, 0.02,   0.95, 0.87, 0.62,   0.10, 0.07, 0.02,
    ],
    fallbackCls: 'wordmark-metal wordmark-metal--gold',
  },
  holo: {
    stops: [
      0.56, 0.61, 1.00,   1.00, 0.83, 0.94,   0.08, 0.08, 0.16,   0.72, 1.00, 0.88,
      1.00, 0.96, 0.72,   0.63, 0.85, 1.00,   0.89, 0.72, 1.00,   0.56, 0.61, 1.00,
    ],
    fallbackCls: 'wordmark-metal wordmark-metal--holo',
  },
} as const
export type MetalPalette = keyof typeof PALETTES

const POSITIONS = [0.0, 0.16, 0.34, 0.5, 0.64, 0.78, 0.92, 1.0]

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('[ChromaticMetal] shader compile failed:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

type Props = {
  text: string
  /** Which metal — chrome (default), gold, or holo. */
  palette?: MetalPalette
  /** Typography classes — applied to the wrapper so the sizer span
      and the rasterised mask share the exact same metrics. */
  className?: string
}

export default function ChromaticMetal({ text, palette = 'chrome', className = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const sizerRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const sizer = sizerRef.current
    const canvas = canvasRef.current
    if (!wrap || !sizer || !canvas) return

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false })
    if (!gl) return // CSS fallback text stays visible

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[ChromaticMetal] program link failed:', gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)
    // Shader is live — hide the CSS-fallback sizer (layout is preserved)
    sizer.style.opacity = '0'

    // Fullscreen quad
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    // Static uniforms
    gl.uniform3fv(gl.getUniformLocation(prog, 'u_stops'), PALETTES[palette].stops)
    gl.uniform1fv(gl.getUniformLocation(prog, 'u_pos'), POSITIONS)
    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')

    // Text mask texture — rasterised from the sizer's computed type
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.uniform1i(gl.getUniformLocation(prog, 'u_mask'), 0)

    const maskCanvas = document.createElement('canvas')
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const drawMask = () => {
      if (w === 0 || h === 0) return
      const cs = getComputedStyle(sizer)
      maskCanvas.width = w
      maskCanvas.height = h
      const ctx = maskCanvas.getContext('2d')!
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#fff'
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${parseFloat(cs.fontSize) * dpr}px ${cs.fontFamily}`
      const tracking = parseFloat(cs.letterSpacing)
      if (!Number.isNaN(tracking)) {
        try {
          ctx.letterSpacing = `${tracking * dpr}px`
        } catch {
          /* older engines — tracking is cosmetic here */
        }
      }
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, w / 2, h / 2 + parseFloat(cs.fontSize) * dpr * 0.04)
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, gl.ALPHA, gl.UNSIGNED_BYTE, maskCanvas)
    }

    const resize = () => {
      const r = wrap.getBoundingClientRect()
      w = Math.max(1, Math.round(r.width * dpr))
      h = Math.max(1, Math.round(r.height * dpr))
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uRes, w, h)
      drawMask()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()
    // Redraw once the display font has actually loaded
    document.fonts?.ready.then(drawMask).catch(() => {})

    let raf = 0
    const t0 = performance.now()
    const frame = () => {
      gl.uniform1f(uTime, ((performance.now() - t0) / 1000) * TIME_SCALE)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(frame)
    }
    frame() // first frame immediately — never blanks

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      sizer.style.opacity = ''
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
      gl.deleteTexture(tex)
    }
  }, [text, palette])

  return (
    <div ref={wrapRef} className={['relative', className].join(' ')}>
      {/* Sizer — invisible once the canvas paints, but keeps layout +
          responsive type, and doubles as the no-WebGL fallback. */}
      <span ref={sizerRef} className={[PALETTES[palette].fallbackCls, 'block'].join(' ')}>
        {text}
      </span>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  )
}
