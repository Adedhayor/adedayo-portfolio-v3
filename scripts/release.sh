#!/usr/bin/env bash
# Promote staging -> main (release). Cloudflare Pages deploys main to adedayobabalola.com.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" != "staging" ]; then
  echo "Release runs from staging (currently on '$branch'). Run: git checkout staging" >&2
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree not clean — commit or stash before releasing." >&2
  exit 1
fi

echo "Building to verify the release…"
npm run build

git fetch origin
git checkout main
git pull origin main
git merge staging --no-ff -m "Release $(date +%Y-%m-%d): staging -> main"
git push origin main

# keep staging aligned with main after the release
git checkout staging
git merge main
git push origin staging

echo ""
echo "Released. Cloudflare Pages is deploying main to adedayobabalola.com."
