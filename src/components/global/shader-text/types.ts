// ============================================================
// Shared type for a wordmark "finish" — a self-contained WebGL2
// fragment shader that fills the masked glyphs. ShaderText owns the
// mask/quad/rAF/resize; a Finish only supplies its shader + statics.
// ============================================================
export type Finish = {
  id: string
  /** Human label shown in the shuffle button's aria-label. */
  label: string
  /**
   * A complete GLSL ES 3.00 fragment shader. It MUST declare
   *   uniform vec2 u_res;         // canvas size in device px
   *   uniform float u_time;       // seconds since mount (raw)
   *   uniform sampler2D u_mask;   // glyph alpha, y-flipped
   *   out vec4 fragColor;
   * sample the mask, `discard` where alpha < 0.01, and write
   * fragColor with the mask alpha so glyph edges stay crisp.
   */
  frag: string
  /** Class(es) on the sizer span — the no-WebGL2 CSS fallback. */
  cssFallback: string
  /** Upload the finish's static uniforms once, after link (palette etc.). */
  setStatic?: (gl: WebGL2RenderingContext, prog: WebGLProgram) => void
}
