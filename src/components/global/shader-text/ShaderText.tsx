// ============================================================
// ShaderText — generic WebGL2 text-fill renderer for the footer
// wordmark. Generalised from the old ChromaticMetal so each finish
// can be its OWN fragment shader (not just a palette): the current
// liquid-metal + the ported FoldGradient/Aurora, and room for more.
//
// It owns everything shared: a WebGL2 context, the glyph mask
// (invisible sizer span → 2D-canvas alpha texture, sampled as u_mask),
// a fullscreen quad, ResizeObserver × devicePixelRatio (never 0×0),
// the rAF loop (frozen under prefers-reduced-motion), a first frame on
// mount, and shader-compile logging. Each Finish supplies its frag +
// static uniforms; ShaderText feeds u_res / u_time / u_mask. If WebGL2
// is unavailable the sizer text stays visible with the finish's CSS
// class as a fallback.
// ============================================================
import { useEffect, useRef } from 'react'
import type { Finish } from './types'

const VERT = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('[ShaderText] shader compile failed:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

type Props = {
  text: string
  /** The active finish — its fragment shader fills the glyphs. */
  finish: Finish
  /** Typography classes — shared by the sizer span and the mask so
      metrics match exactly. */
  className?: string
}

export default function ShaderText({ text, finish, className = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const sizerRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const sizer = sizerRef.current
    const canvas = canvasRef.current
    if (!wrap || !sizer || !canvas) return

    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false, antialias: false })
    if (!gl) return // CSS fallback text stays visible

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, finish.frag)
    if (!vs || !fs) return
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[ShaderText] program link failed:', gl.getProgramInfoLog(prog))
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

    // Finish's static uniforms (palette etc.)
    finish.setStatic?.(gl, prog)

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

    const render = (t: number) => {
      gl.uniform1f(uTime, t)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
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
    document.fonts?.ready.then(drawMask).catch(() => {})

    // Respect reduced-motion: paint a single static frame, no loop.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    const t0 = performance.now()
    if (reduce) {
      render(0)
    } else {
      const frame = () => {
        render((performance.now() - t0) / 1000)
        raf = requestAnimationFrame(frame)
      }
      frame() // first frame immediately — never blanks
    }

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
  }, [text, finish])

  return (
    <div ref={wrapRef} className={['relative', className].join(' ')}>
      {/* Sizer — invisible once the canvas paints, but keeps layout +
          responsive type, and doubles as the no-WebGL2 fallback. */}
      <span ref={sizerRef} className={[finish.cssFallback, 'block'].join(' ')}>
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
