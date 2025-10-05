# Create Ticket

Create a GitHub issue with proper labeling

## Usage
```
/create-ticket <project> <type> <area> <priority> <number> <date> <title>
```
1. - one master ticket for this <title>, with reference to git issue # of sub-tickets.
2. - where each sub-ticket is each high level task is a ticket with subtasks, with reference to its master git issue #.

## Parameters
- **project**: PNX, MOS
- **type**: feat, fix, chore, docs, test, perf, sec, refactor  
- **area**: ui, backend, ml, compliance
- **priority**: critical/high (p0), medium (p1), low (p2)
- **#'of #" where #" is the total number of tickets created for this <title>, and #' is the sequential number of the ticket within the <title>.
- **date**: YYMMDD
- **title**: Brief issue description (quotes not needed)

## Examples
```
/create-ticket [PNX][feat][ui][p1][1of3][250730] Add glucose chart tooltips
/create-ticket [mos][fix][backend][p0][2of5][250801] critical Database connection issue
/create-ticket [pnx][chore][ml][p2][3of4][250812] Update model training scripts
```

## Command Implementation
```bash
PROJECT=$1
TYPE=$2
AREA=$3
PRIORITY=$4
NUMBER=$5
shift 4
TITLE="$*"

if [ "$PROJECT" = "phoenix" ]; then
    PREFIX="PNX"
elif [ "$PROJECT" = "monsteros" ]; then
    PREFIX="MOS"
else
    echo "❌ Invalid project. Use: phoenix or monsteros"
    exit 1
fi

ISSUE_TITLE="[$PREFIX][$TYPE][$AREA][$PRIORITY][$NUMBER]: $TITLE"

BODY="## Description
$TITLE

## Acceptance Criteria
- [ ] TODO: Define acceptance criteria

## Technical Notes
TODO: Add technical implementation notes

## Priority
$PRIORITY"

gh issue create \
  --title "$ISSUE_TITLE" \
  --body "$BODY" \
  --label "project:$PROJECT" \
  --label "priority:$PRIORITY" \
  --label "area:$AREA" \
  --label "status:ready" \
  --label "enhancement"

echo "✅ $PROJECT issue created: $ISSUE_TITLE"
```