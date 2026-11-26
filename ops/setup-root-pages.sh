#!/usr/bin/env bash
set -euo pipefail

source_repo=DaisSu-UI/daisu-ui
target_repo=DaisSu-UI/daissu-ui.github.io
description='Daisu UI documentation (managed by DaisSu-UI/daisu-ui)'
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

# The organization may disable deploy keys. The root repository deploys with
# its own GITHUB_TOKEN and reads only verified public project artifacts.
git_url=${DAISU_ROOT_GIT_URL:-git@github.com:DaisSu-UI/daissu-ui.github.io.git}
git clone --quiet --branch main "$git_url" "$temporary/site"
mkdir -p "$temporary/site/.github/workflows"
cp ops/root-pages.yml "$temporary/site/.github/workflows/publish.yml"
git -C "$temporary/site" add .github/workflows/publish.yml
if ! git -C "$temporary/site" diff --cached --quiet; then
  git -C "$temporary/site" -c user.name='github-actions[bot]' -c user.email='41898282+github-actions[bot]@users.noreply.github.com' commit -m 'ci: publish verified Daisu UI documentation at the organization root'
  git -C "$temporary/site" push origin HEAD:main
fi

cat > "$temporary/pages.json" <<'JSON'
{"build_type":"workflow"}
JSON
if [[ "$("$gh_cli" api "repos/$target_repo" --jq .has_pages)" == true ]]; then
  "$gh_cli" api --method PUT "repos/$target_repo/pages" --input "$temporary/pages.json" >/dev/null
else
  "$gh_cli" api --method POST "repos/$target_repo/pages" --input "$temporary/pages.json" >/dev/null
fi

"$gh_cli" workflow run publish.yml --repo "$target_repo" --ref main
printf '\n根站已配置：https://github.com/%s/actions/workflows/publish.yml\n' "$target_repo"
printf '根站每10分钟检查并同步已验证的项目站产物；检查通过后访问：https://daissu-ui.github.io/\n'
