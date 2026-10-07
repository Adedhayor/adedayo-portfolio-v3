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

/** The sole new shader surface: pointer-responsive, paused when hidden. */
export default function YardSurface({ className = '', controlPosition = 'bottom-left' }: { className?: string; controlPosition?: 'bottom-left' | 'top-right' }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const pointer = useRef([.5, .5])
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [available, setAvailable] = useState(false)
  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const gl = el.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) return
    function compile(type: number, source: string) {
      const shader = gl!.createShader(type)!
      gl!.shaderSource(shader, source); gl!.compileShader(shader)
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) { gl!.deleteShader(shader); return null }
      return shader
    }
    const vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, fragment)
    if (!vs || !fs) return
    const program = gl.createProgram()!
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); return }
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW)
    gl.useProgram(program)
    const pos = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)
    const resolution = gl.getUniformLocation(program, 'resolution'), mouse = gl.getUniformLocation(program, 'pointer'), time = gl.getUniformLocation(program, 'time')
    let frame = 0, visible = false, elapsed = 0, last = 0
    const draw = (now: number) => {
      const ratio = Math.min(window.devicePixelRatio, 1.5)
      const width = Math.max(1, Math.round(el.clientWidth * ratio)), height = Math.max(1, Math.round(el.clientHeight * ratio))
      if (el.width !== width || el.height !== height) { el.width = width; el.height = height }
      if (last) elapsed += Math.min(now-last, 50) / 1000
      last = now
      gl.viewport(0,0,width,height); gl.uniform2f(resolution,width,height)
      gl.uniform2f(mouse,...(reduced ? [.5,.5] : pointer.current) as [number,number]); gl.uniform1f(time,elapsed)
      gl.drawArrays(gl.TRIANGLES,0,6)
      if (visible && !document.hidden && !reduced && !paused) frame = requestAnimationFrame(draw)
    }
    const restart = () => { cancelAnimationFrame(frame); last = 0; if (visible && !document.hidden) draw(performance.now()) }
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; restart() })
    observer.observe(el)
    const resize = new ResizeObserver(restart); resize.observe(el)
    document.addEventListener('visibilitychange', restart)
    const lost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(frame); setAvailable(false) }
    el.addEventListener('webglcontextlost', lost)
    setAvailable(true)
    return () => { cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect(); document.removeEventListener('visibilitychange', restart); el.removeEventListener('webglcontextlost', lost); gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs) }
  }, [reduced, paused])
  return <div className={`yard-surface relative min-h-[260px] overflow-hidden bg-[#24393b] ${className}`} onPointerMove={event => { const bounds = event.currentTarget.getBoundingClientRect(); pointer.current = [(event.clientX-bounds.left)/bounds.width, 1-(event.clientY-bounds.top)/bounds.height] }} onPointerLeave={() => { pointer.current=[.5,.5] }}>
    <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    {available && !reduced && <button type="button" aria-pressed={paused} aria-label={paused ? 'Play shader motion' : 'Pause shader motion'} title={paused ? 'Play motion' : 'Pause motion'} onClick={() => setPaused(value => !value)} className={`absolute z-20 grid size-10 place-items-center border border-white/50 bg-black/55 text-white backdrop-blur-sm transition-[transform,background-color] duration-150 [transition-timing-function:var(--opt-easing-expo)] hover:bg-black/70 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${controlPosition === 'top-right' ? 'right-5 top-5' : 'bottom-5 left-5'}`}>
      {paused ? <Play size={15} fill="currentColor" aria-hidden="true" /> : <Pause size={15} fill="currentColor" aria-hidden="true" />}
    </button>}
  </div>
}
