#!/usr/bin/env bash
set -euo pipefail

site=${1:?Specify the verified site directory}
target=${2:?Specify the organization site checkout}
site=$(realpath "$site")
target=$(realpath "$target")
if [[ "$site" == "$target" || "$site" == "$target/"* || "$target" == "$site/"* || ! -d "$target/.git" || -e "$site/.git" ]]; then
  printf 'Expected separate site artifacts and a Git checkout.\n' >&2
  exit 1
fi
if [[ ! -f "$site/.nojekyll" ]]; then
  printf 'The static site must contain .nojekyll.\n' >&2
  exit 1
fi
node scripts/docs-release.mjs verify --source "$site"

rsync -a --delete --exclude=/.git/ -- "$site/" "$target/"
git -C "$target" config user.name 'github-actions[bot]'
git -C "$target" config user.email '41898282+github-actions[bot]@users.noreply.github.com'
git -C "$target" add --all
if git -C "$target" diff --cached --quiet; then
  printf 'Organization site already matches the verified documentation.\n'
  exit 0
fi
git -C "$target" commit -m "docs: publish ${GITHUB_SHA:-verified documentation}"
git -C "$target" push origin HEAD:main
