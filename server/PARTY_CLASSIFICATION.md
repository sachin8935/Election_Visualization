# National vs Regional Party Classification

## Enhancement

Added party classification knowledge to the Gemini AI prompt so it can correctly differentiate between national and regional parties in Indian elections.

## National Parties (7 total)

According to the Election Commission of India, these are the recognized **national parties**:

1. **AAP** - Aam Aadmi Party
2. **BJP** - Bharatiya Janata Party  
3. **INC** - Indian National Congress
4. **BSP** - Bahujan Samaj Party
5. **CPI** - Communist Party of India
6. **CPI-M** - Communist Party of India (Marxist)
7. **NCP** - Nationalist Congress Party

## Regional Parties

All other parties are classified as **regional parties**, including:

- **AITC** - All India Trinamool Congress (West Bengal)
- **DMK** - Dravida Munnetra Kazhagam (Tamil Nadu)
- **ADMK** - All India Anna Dravida Munnetra Kazhagam (Tamil Nadu)
- **SP** - Samajwadi Party (Uttar Pradesh)
- **TDP** - Telugu Desam Party (Andhra Pradesh)
- **BJD** - Biju Janata Dal (Odisha)
- **SHS** - Shiv Sena (Maharashtra)
- **JD-U** - Janata Dal (United) (Bihar)
- And many others

## SQL Classification Pattern

To classify parties in SQL queries, use:

```sql
CASE 
  WHEN "Party" IN ('AAP', 'BJP', 'INC', 'BSP', 'CPI', 'CPI-M', 'NCP') 
  THEN 'National' 
  ELSE 'Regional' 
END as party_type
```

## Example Query: Vote Share Over Time

**Question**: "How has the vote share of national vs regional parties changed over time?"

**Generated SQL**:
```sql
SELECT
    "Year",
    CASE 
      WHEN "Party" IN ('AAP', 'BJP', 'INC', 'BSP', 'CPI', 'CPI-M', 'NCP') 
      THEN 'National' 
      ELSE 'Regional' 
    END AS party_type,
    ROUND(
        (SUM("Votes") * 100.0 / SUM(SUM("Votes")) OVER (PARTITION BY "Year"))::numeric,
        2
    ) AS vote_share_percentage
FROM
    election_loksabha_data
GROUP BY
    "Year",
    party_type
ORDER BY
    "Year",
    party_type;
```

This query will show how the vote share has shifted between national and regional parties across different election years (1991-2019).

## What Changed

### 1. Added Party Classification Section to Schema Context

```javascript
PARTY CLASSIFICATION (National vs Regional):
NATIONAL PARTIES (only these 7):
- 'AAP' (Aam Aadmi Party)
- 'BJP' (Bharatiya Janata Party)
- 'INC' (Indian National Congress)
- 'BSP' (Bahujan Samaj Party)
- 'CPI' (Communist Party of India)
- 'CPI-M' (Communist Party of India - Marxist)
- 'NCP' (Nationalist Congress Party)

REGIONAL PARTIES (all others including):
- 'AITC', 'DMK', 'ADMK', 'SP', 'TDP', 'BJD', 'SHS', 'JD-U', etc.

To classify parties in queries:
- Use CASE WHEN "Party" IN ('AAP', 'BJP', 'INC', 'BSP', 'CPI', 'CPI-M', 'NCP') THEN 'National' ELSE 'Regional' END
```

### 2. Added Example Pattern

```javascript
National vs Regional party vote share over time:
  SELECT 
    "Year",
    CASE 
      WHEN "Party" IN ('AAP', 'BJP', 'INC', 'BSP', 'CPI', 'CPI-M', 'NCP') 
      THEN 'National' 
      ELSE 'Regional' 
    END as party_type,
    SUM("Votes") as total_votes,
    AVG("Vote_Share_Percentage") as avg_vote_share
  FROM election_loksabha_data
  GROUP BY "Year", party_type
  ORDER BY "Year", party_type;
```

### 3. Added Complete Example in Prompt

Added this to the EXAMPLES section so Gemini has a concrete reference:

```javascript
Question: "How has the vote share of national vs regional parties changed over time?"
Query: SELECT "Year", CASE WHEN "Party" IN ('AAP', 'BJP', 'INC', 'BSP', 'CPI', 'CPI-M', 'NCP') THEN 'National' ELSE 'Regional' END as party_type, SUM("Votes") as total_votes, ROUND(AVG("Vote_Share_Percentage")::numeric, 2) as avg_vote_share_pct, COUNT(DISTINCT "Party") as num_parties FROM election_loksabha_data GROUP BY "Year", party_type ORDER BY "Year", party_type LIMIT 100;
```

## Files Modified

- `server/gemini.js` - Added party classification knowledge and examples

## Test Results

✅ Gemini correctly generates SQL with all 7 national parties  
✅ Uses CASE WHEN for proper classification  
✅ Properly groups and aggregates data by year and party type  
✅ Ready to answer questions about national vs regional party trends

## Sample Questions Now Supported

1. "How has the vote share of national vs regional parties changed over time?"
2. "Compare seats won by national vs regional parties in 2019"
3. "Which type of party (national or regional) has more seats in recent elections?"
4. "Show me the trend of regional party growth over the years"
5. "What percentage of votes go to national parties vs regional parties?"

All these questions will now correctly classify the 7 national parties and treat all others as regional parties!
