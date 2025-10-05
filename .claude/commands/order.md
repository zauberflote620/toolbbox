---
description: Parse email order and match products. Zero friction - paste and done.
arguments: Email text to process
tools:
  - Read
  - Bash
---

# Quick Order Processor

`/order [email]` - Paste email, get formatted reply + Shopify JSON

## What it does
1. Parses email for customer, items, quantities, GL codes
2. Fuzzy matches to product catalog
3. Returns formatted email reply table + Shopify JSON

## Usage
```
/order Jane wants 4 bags with scaffolding materials, GL code 12335
```

## Processing

Running order processor on: $ARGUMENTS

```bash
cd /Users/ambienthex/Projects_MacLocal/monsterOS_local
python app/tools/order.py "$ARGUMENTS"
```