#!/usr/bin/env bash
set -euo pipefail

source_repo=DaisSu-UI/daisu-ui
target_repo=DaisSu-UI/daissu-ui.github.io
description='Daisu UI documentation (managed by DaisSu-UI/daisu-ui)'
key_title='Daisu UI documentation publisher'
if [[ -n "${DAISU_GH_BIN:-}" ]]; then
  gh_cli=$DAISU_GH_BIN
elif command -v gh >/dev/null 2>&1; then
  gh_cli=$(command -v gh)
elif [[ -x /tmp/daisu-github-cli/bin/gh ]]; then
  gh_cli=/tmp/daisu-github-cli/bin/gh
else
  printf 'Install GitHub CLI and run gh auth login first.\n' >&2
  exit 1
fi

temporary=$(mktemp -d)
chmod 700 "$temporary"
trap 'rm -rf "$temporary"' EXIT
printf '验证当前 GitHub 登录：\n'
"$gh_cli" api user --jq .login
"$gh_cli" api "repos/$source_repo" >/dev/null

# Listing the organization first distinguishes a missing repository from an
# authentication or network error before attempting creation.
existing=$("$gh_cli" api orgs/DaisSu-UI/repos --paginate --jq '.[] | select(.name == "daissu-ui.github.io") | .full_name')
if [[ -z "$existing" ]]; then
  "$gh_cli" repo create "$target_repo" --public --description "$description" --add-readme
elif [[ "$("$gh_cli" api "repos/$target_repo" --jq .description)" != "$description" ]]; then
  printf '组织站仓库已存在且未标记为本项目的发布仓库，已停止以保留其中内容：%s\n' "$target_repo" >&2
  exit 1
fi

default_branch=$("$gh_cli" api "repos/$target_repo" --jq .default_branch)
if [[ "$default_branch" != main ]]; then
  default_sha=$("$gh_cli" api "repos/$target_repo/git/ref/heads/$default_branch" --jq .object.sha)
  "$gh_cli" api --method POST "repos/$target_repo/git/refs" -f ref=refs/heads/main -f sha="$default_sha" >/dev/null
  "$gh_cli" api --method PATCH "repos/$target_repo" -f default_branch=main >/dev/null
fi

existing_key=$("$gh_cli" api "repos/$target_repo/keys" --jq '.[] | select(.title == "Daisu UI documentation publisher") | .id')
existing_secret=$("$gh_cli" secret list --repo "$source_repo" --json name --jq '.[] | select(.name == "DOCS_ROOT_DEPLOY_KEY") | .name')
if [[ -z "$existing_key" || -z "$existing_secret" ]]; then
  # This credential can write only the dedicated publication repository. It is
  # generated locally, encrypted as an Actions secret, and never printed.
  ssh-keygen -q -t ed25519 -N '' -C "$key_title" -f "$temporary/deploy-key"
  python3 - "$temporary" "$key_title" <<'PY'
import json, pathlib, sys
directory = pathlib.Path(sys.argv[1])
body = {'title': sys.argv[2], 'key': (directory / 'deploy-key.pub').read_text().strip(), 'read_only': False}
(directory / 'deploy-key.json').write_text(json.dumps(body))
PY
  "$gh_cli" api --method POST "repos/$target_repo/keys" --input "$temporary/deploy-key.json" >/dev/null
  "$gh_cli" secret set DOCS_ROOT_DEPLOY_KEY --repo "$source_repo" < "$temporary/deploy-key"
fi

cat > "$temporary/pages.json" <<'JSON'
{"build_type":"legacy","source":{"branch":"main","path":"/"}}
JSON
if [[ "$("$gh_cli" api "repos/$target_repo" --jq .has_pages)" == true ]]; then
  "$gh_cli" api --method PUT "repos/$target_repo/pages" --input "$temporary/pages.json" >/dev/null
else
  "$gh_cli" api --method POST "repos/$target_repo/pages" --input "$temporary/pages.json" >/dev/null
fi
"$gh_cli" variable set DOCS_ROOT_PAGES_ENABLED --repo "$source_repo" --body true

# Run this after the workflow change reaches main. Future main pushes publish
# both the project site and this root site without any manual synchronization.
"$gh_cli" workflow run documentation.yml --repo "$source_repo" --ref main -f channel=pages
printf '\n根站已配置，首次部署正在执行：https://github.com/%s/actions/workflows/documentation.yml\n' "$source_repo"
printf '检查通过后访问：https://daissu-ui.github.io/\n'
