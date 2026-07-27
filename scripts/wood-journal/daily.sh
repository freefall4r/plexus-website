#!/bin/bash
# Wood Journal — daily article machine for plexusworkshop.com/wood-library
# Runs via LaunchAgent com.plexus.woodjournal (08:30 daily).
# Flow: pick next topic → claude -p writes one article JSON → validate →
# commit ONLY that file → vercel --prod. Any failure = clean abort, no deploy.

set -u
REPO="/Users/anahata/Desktop/Plexus/plexus-amman"
DIR="$REPO/scripts/wood-journal"
LOG="$DIR/journal.log"
CLAUDE="/Users/anahata/.local/bin/claude"
VERCEL="/Users/anahata/.npm-global/bin/vercel"
ARTICLES="$REPO/content/wood-articles"

cd "$REPO" || exit 1
exec >>"$LOG" 2>&1
echo "════ $(date '+%F %T') — wood journal run ════"

touch "$DIR/done.txt"
TOPIC=$(grep -vxF -f "$DIR/done.txt" "$DIR/topics.txt" | grep -v '^[[:space:]]*$' | head -1)
if [ -z "$TOPIC" ]; then
  echo "topic queue is empty — nothing to do"
  /usr/bin/osascript -e 'display notification "Topic queue is empty — add topics to scripts/wood-journal/topics.txt" with title "Wood Journal"' || true
  exit 0
fi
DATE=$(date '+%F')
echo "topic: $TOPIC"

MARKER=$(mktemp /tmp/woodjournal.XXXXXX)
PROMPT=$(sed -e "s/{{DATE}}/$DATE/g" "$DIR/writer-prompt.md" | sed -e "s|{{TOPIC}}|${TOPIC//|/-}|g")

"$CLAUDE" -p "$PROMPT" \
  --allowedTools "WebSearch,WebFetch,Read,Write,Glob,Grep" \
  --max-turns 40 || echo "claude exited non-zero (continuing to check output)"

NEW=$(find "$ARTICLES" -name '*.json' -newer "$MARKER" | head -1)
rm -f "$MARKER"
# whatever happens next, don't retry this topic tomorrow
echo "$TOPIC" >>"$DIR/done.txt"

if [ -z "$NEW" ]; then
  echo "FAIL: no new article file was written"
  /usr/bin/osascript -e 'display notification "Today'"'"'s article was NOT written — check journal.log" with title "Wood Journal"' || true
  exit 1
fi
echo "new file: $NEW"

if ! /usr/bin/python3 "$DIR/validate.py" "$NEW" "$REPO/public"; then
  echo "FAIL: validation rejected the article — removing it, no deploy"
  rm -f "$NEW"
  /usr/bin/osascript -e 'display notification "Article failed validation — nothing deployed" with title "Wood Journal"' || true
  exit 1
fi

SLUG=$(basename "$NEW" .json)
# Shared repo: commit ONLY our two paths, never the working tree at large.
git add -- "$NEW" "$DIR/done.txt"
git commit -m "journal: daily article — $SLUG" -- "$NEW" "$DIR/done.txt" || {
  echo "WARN: git commit failed (continuing to deploy anyway)"
}

if "$VERCEL" --prod --yes; then
  echo "DEPLOYED: $SLUG"
  /usr/bin/osascript -e "display notification \"Today's article is live: $SLUG\" with title \"Wood Journal 🌳\"" || true
else
  echo "FAIL: vercel deploy failed"
  /usr/bin/osascript -e 'display notification "Deploy failed — article committed but not live" with title "Wood Journal"' || true
  exit 1
fi
