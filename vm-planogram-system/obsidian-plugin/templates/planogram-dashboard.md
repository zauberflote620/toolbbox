# Planogram Analytics Dashboard

## All Planograms
```dataview
TABLE
  name as "Planogram",
  store as "Store",
  fixtures_count as "Fixtures",
  vm_strategy as "Strategy",
  modified as "Last Modified"
FROM "planograms"
SORT modified DESC
```

## High-Fixture Planograms (10+ fixtures)
```dataview
LIST
FROM "planograms"
WHERE fixtures_count > 10
SORT fixtures_count DESC
```

## Recent Updates (Last 7 Days)
```dataview
TABLE
  name as "Planogram",
  store as "Store",
  modified as "Modified"
FROM "planograms"
WHERE date(modified) > date(today) - dur(7 days)
SORT modified DESC
```

## VM Strategy Distribution
```dataview
TABLE WITHOUT ID
  vm_strategy as "Strategy",
  length(rows) as "Count"
FROM "planograms"
GROUP BY vm_strategy
```

## Store Coverage
```dataview
TABLE WITHOUT ID
  store as "Store",
  length(rows) as "Planogram Count",
  sum(fixtures_count) as "Total Fixtures"
FROM "planograms"
GROUP BY store
SORT sum(fixtures_count) DESC
```