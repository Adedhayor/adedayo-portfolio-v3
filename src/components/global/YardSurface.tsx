import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Pause, Play } from 'lucide-react'

const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`
const fragment = `precision mediump float;
uniform vec2 resolution; uniform vec2 pointer; uniform float time;
void main(){
 vec2 uv=gl_FragCoord.xy/resolution;
 vec2 p=(uv-.5)*vec2(resolution.x/resolution.y,1.);
 p+=(pointer-.5)*.16;
 float wave=sin(p.x*6.+sin(p.y*5.+time*.3)*1.4+time*.25);
 float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
 float band=smoothstep(-.5,.8,wave);
 vec3 ink=vec3(.13,.23,.24), paper=vec3(.84,.85,.70), rust=vec3(.77,.43,.29);
 vec3 color=mix(ink,paper,band);
 color=mix(color,rust,smoothstep(.5,1.,sin(p.y*4.-p.x+time*.13))*.65);
 gl_FragColor=vec4(color+(grain-.5)*.055,1.);
}`

type Props = {
  className?: string
  controlPosition?: 'bottom-left' | 'top-right'
}

/** A pointer-responsive shader that pauses while hidden or on request. */
export default function YardSurface({ className = '', controlPosition = 'bottom-left' }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const pointer = useRef([0.5, 0.5])
  const pausedRef = useRef(false)
  const restartRef = useRef<() => void>(() => {})
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    const el = canvas.current
    if (!el) return

    const gl = el.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) return
    const context = gl

    function compile(type: number, source: string) {
      const shader = context.createShader(type)
      if (!shader) return null
      context.shaderSource(shader, source)
      context.compileShader(shader)
      if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        context.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = compile(gl.VERTEX_SHADER, vertex)
    const fs = compile(gl.FRAGMENT_SHADER, fragment)
    if (!vs || !fs) return

    const program = gl.createProgram()
    const buffer = gl.createBuffer()
    if (!program || !buffer) {
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      return
    }

    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      return
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
    gl.useProgram(program)

    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const resolution = gl.getUniformLocation(program, 'resolution')
    const mouse = gl.getUniformLocation(program, 'pointer')
    const time = gl.getUniformLocation(program, 'time')
    let frame = 0
    let visible = false
    let elapsed = 0
    let last = 0

    const draw = (now: number) => {
      const ratio = Math.min(window.devicePixelRatio, 1.5)
      const width = Math.max(1, Math.round(el.clientWidth * ratio))
      const height = Math.max(1, Math.round(el.clientHeight * ratio))
      if (el.width !== width || el.height !== height) {
        el.width = width
        el.height = height
      }
      if (last) elapsed += Math.min(now - last, 50) / 1000
      last = now
      gl.viewport(0, 0, width, height)
      gl.uniform2f(resolution, width, height)
      const [x, y] = reduced ? [0.5, 0.5] : pointer.current
      gl.uniform2f(mouse, x, y)
      gl.uniform1f(time, elapsed)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      if (visible && !document.hidden && !reduced && !pausedRef.current) frame = requestAnimationFrame(draw)
    }

    const restart = () => {
      cancelAnimationFrame(frame)
      last = 0
      if (visible && !document.hidden) draw(performance.now())
    }
    restartRef.current = restart
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
      restart()
    })
    const resize = new ResizeObserver(restart)
    const lost = (event: Event) => {
      event.preventDefault()
      cancelAnimationFrame(frame)
      setAvailable(false)
    }

    observer.observe(el)
    resize.observe(el)
    document.addEventListener('visibilitychange', restart)
    el.addEventListener('webglcontextlost', lost)
    setAvailable(true)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resize.disconnect()
      document.removeEventListener('visibilitychange', restart)
      el.removeEventListener('webglcontextlost', lost)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      restartRef.current = () => {}
    }
  }, [reduced])

  return (
    <div
      className={`yard-surface relative min-h-[260px] overflow-hidden bg-[#24393b] ${className}`}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        pointer.current = [
          (event.clientX - bounds.left) / bounds.width,
          1 - (event.clientY - bounds.top) / bounds.height,
        ]
      }}
      onPointerLeave={() => { pointer.current = [0.5, 0.5] }}
    >
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      {available && !reduced ? (
        <button
          type="button"
          aria-pressed={paused}
          aria-label={paused ? 'Play shader motion' : 'Pause shader motion'}
          title={paused ? 'Play motion' : 'Pause motion'}
          onClick={() => {
            const next = !paused
            pausedRef.current = next
            setPaused(next)
            if (!next) restartRef.current()
          }}
          className={`absolute z-20 grid size-10 place-items-center border border-white/50 bg-black/55 text-white backdrop-blur-sm transition-[transform,background-color] duration-150 [transition-timing-function:var(--opt-easing-expo)] hover:bg-black/70 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${controlPosition === 'top-right' ? 'right-5 top-5' : 'bottom-5 left-5'}`}
        >
          {paused ? <Play size={15} fill="currentColor" aria-hidden="true" /> : <Pause size={15} fill="currentColor" aria-hidden="true" />}
        </button>
      ) : null}
    </div>
  )
}
