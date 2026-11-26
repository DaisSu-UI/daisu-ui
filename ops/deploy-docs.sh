#!/usr/bin/env bash
set -euo pipefail
: "${DOCS_SSH_TARGET:?Configure DOCS_SSH_TARGET (user@host)}"
: "${DOCS_DEPLOY_ROOT:?Configure DOCS_DEPLOY_ROOT}"
channel=${1:?Specify production or previews/branch}
mode=${2:-deploy}
if [[ ! "$DOCS_SSH_TARGET" =~ ^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+$ ]] || [[ ! "$DOCS_DEPLOY_ROOT" =~ ^/[a-zA-Z0-9_./-]+$ ]] || [[ "$DOCS_DEPLOY_ROOT" == *..* ]] || [[ "$DOCS_DEPLOY_ROOT" == / ]]; then
  echo 'Invalid deployment target or root' >&2; exit 1
fi
if [[ "$channel" != production && ! "$channel" =~ ^previews/[a-zA-Z0-9][a-zA-Z0-9_-]{0,100}$ ]]; then echo 'Invalid channel' >&2; exit 1; fi
# SSH keys and known_hosts are supplied by the runner, never disabled here.
ssh "$DOCS_SSH_TARGET" "mkdir -p '$DOCS_DEPLOY_ROOT'"
scp scripts/docs-release.mjs "$DOCS_SSH_TARGET:$DOCS_DEPLOY_ROOT/.docs-release.mjs"
if [[ "$mode" == rollback ]]; then
  : "${DOCS_ROLLBACK_RELEASE:?Select an existing release ID}"
  if [[ ! "$DOCS_ROLLBACK_RELEASE" =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]{0,100}$ ]] || [[ "$DOCS_ROLLBACK_RELEASE" == *..* ]]; then echo 'Invalid rollback ID' >&2; exit 1; fi
  ssh "$DOCS_SSH_TARGET" "node '$DOCS_DEPLOY_ROOT/.docs-release.mjs' rollback --root '$DOCS_DEPLOY_ROOT' --channel '$channel' --id '$DOCS_ROLLBACK_RELEASE'"
elif [[ "$mode" == deploy ]]; then
  node scripts/docs-release.mjs verify --source artifacts/docs-site
  incoming=".upload-${CI_JOB_ID:-local}-$(date +%s)"
  if [[ ! "$incoming" =~ ^[a-zA-Z0-9._-]+$ ]]; then echo 'Invalid upload ID' >&2; exit 1; fi
  tar -czf artifacts/docs-site.tgz -C artifacts/docs-site .
  scp artifacts/docs-site.tgz "$DOCS_SSH_TARGET:$DOCS_DEPLOY_ROOT/$incoming.tgz"
  ssh "$DOCS_SSH_TARGET" "mkdir '$DOCS_DEPLOY_ROOT/$incoming' && tar -xzf '$DOCS_DEPLOY_ROOT/$incoming.tgz' -C '$DOCS_DEPLOY_ROOT/$incoming' && node '$DOCS_DEPLOY_ROOT/.docs-release.mjs' deploy --source '$DOCS_DEPLOY_ROOT/$incoming' --root '$DOCS_DEPLOY_ROOT' --channel '$channel'"
else
  echo 'Use deploy or rollback' >&2; exit 1
fi
