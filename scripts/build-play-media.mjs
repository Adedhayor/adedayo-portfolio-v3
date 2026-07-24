#!/usr/bin/env node
// ============================================================
// build-play-media — transcodes raw demo recordings into the
// short muted loops the /play world uses as video textures.
//
//   drop:   assets-src/demos/<screenId>.(mov|mp4|webm|mkv|avi)
//           <screenId> must match a ScreenContent.id in
//           src/play/data/playground.ts
//   output: public/play-media/<screenId>.mp4         (committed)
//           public/play-media/<screenId>.poster.jpg  (committed)
//
// Targets: 960px wide, 24fps, H.264 yuv420p, no audio,
// ~1.5–4MB per 10–20s loop. Skips outputs newer than their
// source. Requires ffmpeg on PATH (`brew install ffmpeg`).
//
// Usage: node scripts/build-play-media.mjs [--force]
// ============================================================
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const DROP_DIR = path.join(ROOT, 'assets-src', 'demos')
const OUT_DIR = path.join(ROOT, 'public', 'play-media')
const FORCE = process.argv.includes('--force')
const EXTENSIONS = new Set(['.mov', '.mp4', '.webm', '.mkv', '.avi'])

try {
  execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' })
} catch {
  console.error('ffmpeg not found on PATH — install it first (brew install ffmpeg).')
  process.exit(1)
}

mkdirSync(OUT_DIR, { recursive: true })

const sources = existsSync(DROP_DIR)
  ? readdirSync(DROP_DIR).filter((f) => EXTENSIONS.has(path.extname(f).toLowerCase()))
  : []

if (sources.length === 0) {
  console.log(`No recordings in ${path.relative(ROOT, DROP_DIR)} — drop <screenId>.mov files there.`)
  process.exit(0)
}

let built = 0
for (const file of sources) {
  const id = path.basename(file, path.extname(file))
  const src = path.join(DROP_DIR, file)
  const outVideo = path.join(OUT_DIR, `${id}.mp4`)
  const outPoster = path.join(OUT_DIR, `${id}.poster.jpg`)

  const fresh =
    !FORCE &&
    existsSync(outVideo) &&
    existsSync(outPoster) &&
    statSync(outVideo).mtimeMs > statSync(src).mtimeMs
  if (fresh) {
    console.log(`· ${id} — up to date`)
    continue
  }

  console.log(`▸ ${id} — transcoding…`)
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-i', src,
      '-an',
      '-vf', 'scale=960:-2:flags=lanczos,fps=24',
      '-c:v', 'libx264',
      '-profile:v', 'main',
      '-pix_fmt', 'yuv420p',
      '-crf', '26',
      '-preset', 'slow',
      '-movflags', '+faststart',
      outVideo,
    ],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  )
  execFileSync(
    'ffmpeg',
    ['-y', '-ss', '1', '-i', outVideo, '-frames:v', '1', '-q:v', '4', outPoster],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  )
  const mb = (statSync(outVideo).size / 1024 / 1024).toFixed(1)
  console.log(`  ${path.relative(ROOT, outVideo)} (${mb}MB) + poster`)
  built++
}

console.log(`Done — ${built} built, ${sources.length - built} up to date.`)
console.log('Remember: set the matching video/poster paths in src/play/data/playground.ts')
