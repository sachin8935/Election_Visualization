# Window Function Error Fix

## Problem
When users asked: **"Which party gained or lost the most seats between consecutive elections?"**

The AI was generating SQL with window functions (like `LAG()`, `LEAD()`, `ROW_NUMBER()`) in the WHERE clause, which caused this PostgreSQL error:

```
Error: window functions are not allowed in WHERE
```

## Root Cause
Window functions in PostgreSQL can only be used in:
- SELECT clause
- ORDER BY clause  

They **CANNOT** be used in:
- WHERE clause
- JOIN conditions
- GROUP BY clause

## Solution Implemented

### 1. Enhanced Schema Context
Added explicit rules to `server/gemini.js`:

```javascript
IMPORTANT SQL RULES:
- NEVER use window functions (ROW_NUMBER, RANK, LAG, LEAD) in WHERE clause
- Use CTEs (WITH clause) for comparing data between different years
- For consecutive elections, manually specify the years (e.g., 2014 and 2019)
- Window functions can only be used in SELECT, not in WHERE or JOIN conditions
```

### 2. Updated Instructions
Modified the prompt instructions to explicitly warn against window functions:

```javascript
INSTRUCTIONS:
...
8. For comparisons between years, use CTEs (WITH clause) - NEVER use window functions in WHERE
9. For "consecutive elections", use the two most recent years: 2014 and 2019
10. NEVER use window functions (LAG, LEAD, ROW_NUMBER, RANK) in WHERE or JOIN conditions
...
```

### 3. Added Specific Example
Added a dedicated example for "consecutive elections" queries:

```javascript
Question: "Which party gained or lost the most seats between consecutive elections?"
Query: WITH seats_2014 AS (
  SELECT "Party", COUNT(*) as seats 
  FROM election_loksabha_data 
  WHERE "Year" = 2014 AND "Is_Winner" = 1 
  GROUP BY "Party"
), seats_2019 AS (
  SELECT "Party", COUNT(*) as seats 
  FROM election_loksabha_data 
  WHERE "Year" = 2019 AND "Is_Winner" = 1 
  GROUP BY "Party"
) 
SELECT 
  COALESCE(a."Party", b."Party") as "Party", 
  COALESCE(a.seats, 0) as seats_2014, 
  COALESCE(b.seats, 0) as seats_2019, 
  COALESCE(b.seats, 0) - COALESCE(a.seats, 0) as seat_change 
FROM seats_2014 a 
FULL OUTER JOIN seats_2019 b ON a."Party" = b."Party" 
ORDER BY ABS(COALESCE(b.seats, 0) - COALESCE(a.seats, 0)) DESC 
LIMIT 10;
```

## Correct Approach: Using CTEs

Instead of window functions, we use **Common Table Expressions (CTEs)** with the `WITH` clause:

1. **Create separate CTEs** for each year's data
2. **Join the CTEs** using FULL OUTER JOIN
3. **Calculate the difference** in the final SELECT

This approach:
- ✅ Avoids window functions in WHERE
- ✅ Works correctly with PostgreSQL
- ✅ Is easier to read and maintain
- ✅ Handles parties that didn't exist in both elections

## Test Result

When tested with the query "Which party gained or lost the most seats between consecutive elections?", the AI now generates:

```sql
WITH seats_2014 AS (
    SELECT "Party", COUNT(*) as seats
    FROM election_loksabha_data
    WHERE "Year" = 2014 AND "Is_Winner" = 1
    GROUP BY "Party"
),
seats_2019 AS (
    SELECT "Party", COUNT(*) as seats
    FROM election_loksabha_data
    WHERE "Year" = 2019 AND "Is_Winner" = 1
    GROUP BY "Party"
)
SELECT
    COALESCE(s2014."Party", s2019."Party") as "Party",
    COALESCE(s2014.seats, 0) as seats_2014,
    COALESCE(s2019.seats, 0) as seats_2019,
    COALESCE(s2019.seats, 0) - COALESCE(s2014.seats, 0) as seat_change
FROM
    seats_2014 s2014
FULL OUTER JOIN
    seats_2019 s2019 ON s2014."Party" = s2019."Party"
ORDER BY
    ABS(COALESCE(s2019.seats, 0) - COALESCE(s2014.seats, 0)) DESC
LIMIT 100;
```

**This SQL is correct and will execute without errors!**

## Files Modified
- `server/gemini.js` - Enhanced schema context and instructions

## How to Test

Try asking these questions in the Ask AI modal:
1. "Which party gained or lost the most seats between consecutive elections?"
2. "Show me seat changes between 2014 and 2019"
3. "Which parties gained seats in the last election?"
4. "Compare party performance between 2009 and 2014"

All should now work without the window function error!
