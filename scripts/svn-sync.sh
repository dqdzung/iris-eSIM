#!/usr/bin/env bash
# Stage an SVN deploy working copy for commit after copy-dist has mirrored the
# build into it. Does two things, then stops — the commit is left to you:
#   1. svn rm  <missing>   — files SVN tracks but that are now gone from disk
#   2. svn add <new>       — new unversioned files/dirs (ignored files skipped)
#
#   bash scripts/svn-sync.sh <svn-working-copy>
#
# The path may be the working-copy root or any versioned subfolder of it —
# SVN 1.7+ keeps a single .svn at the root and finds it by walking up.

set -uo pipefail

TARGET="${1:?usage: bash scripts/svn-sync.sh <svn-working-copy>}"

# `svn info` succeeds anywhere inside a working copy (unlike checking for a
# local .svn dir, which only exists at the root since SVN 1.7).
if ! svn info "$TARGET" >/dev/null 2>&1; then
  echo "svn-sync: '$TARGET' is not inside an SVN working copy" >&2
  exit 1
fi

cd "$TARGET"

echo "svn-sync: scheduling deletions (files removed from disk)..."
# Status '!' = item missing locally but still versioned. Strip the leading
# status flag + whitespace; the rest is the path (kept intact, spaces and all).
svn status | grep '^!' | sed 's/^![[:space:]]*//' | while IFS= read -r f; do
  [ -n "$f" ] && svn rm "$f"
done

echo "svn-sync: scheduling additions (new files)..."
# --force lets `add` descend the already-versioned root and pick up unversioned
# children; svn:ignore entries are still skipped.
svn add --force . --depth infinity -q

echo
echo "svn-sync: done. Review with 'svn status', then run 'svn commit' yourself."
