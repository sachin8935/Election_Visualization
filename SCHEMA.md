# 📊 Election Visualization Project - Database Schema

## 1️⃣ Dataset Overview

### Dataset Information
- **Dataset Name**: ElectionData
- **Source**: [Google Drive Link](https://drive.google.com/file/d/16RRKqccof_BTxn9Y20ysGNLU8Pmxmg_-/view?usp=drive_link)
- **Description**: Comprehensive dataset containing detailed records of all candidates who contested in Indian Lok Sabha (Parliamentary) General Elections
- **Coverage**: Indian Lok Sabha Elections from **1991 to 2019** (8 election cycles)
- **Total Records**: **63,100** candidate-level entries
- **Total Columns**: **47** attributes per record
- **Granularity**: Each record represents a unique candidate contesting in a specific parliamentary constituency during one Lok Sabha election year

### Election Years Covered
- 1991, 1996, 1998, 1999, 2004, 2009, 2014, 2019

### Key Statistics
- **Gender Distribution**: ~92% Male, ~6% Female, ~2% Other/Unknown
- **Turnout Range**: 40-80% (normal democratic participation rates)
- **Major Parties**: INC (Indian National Congress), BJP (Bharatiya Janata Party), BSP (Bahujan Samaj Party), SP (Samajwadi Party), CPI, CPIM, TMC, AITC, and 100+ regional parties

---

## 2️⃣ Data Cleaning & Preprocessing

Comprehensive data cleaning was performed to ensure data quality, consistency, and analytical readiness.

| Step | Action Taken | Purpose |
|------|-------------|---------|
| 1 | Filtered dataset to years **1991–2019** only | Restricted to modern Lok Sabha elections |
| 2 | Removed duplicate candidate entries | Ensure unique records |
| 3 | Standardized text columns (`State_Name`, `Party`, `Candidate`) | Consistency for grouping and filters |
| 4 | Dropped rows missing essential data (`Year`, `State_Name`, `Party`, `Candidate`) | Maintain data quality |
| 5 | Replaced missing non-critical fields with `Unknown` | Preserve structure |
| 6 | Converted numeric fields to correct types (`Votes`, `Margin`, `Electors`) | Support aggregation |
| 7 | Added derived columns (`Vote_Share_Calc`, `Is_Winner`) | Enable analytical queries |
| 8 | Removed unrealistic values (`Turnout_Percentage > 100`) | Clean anomalies |

### Verification Checks Passed ✅
- ✓ Valid years: 1991, 1996, 1998, 1999, 2004, 2009, 2014, 2019
- ✓ Gender distribution realistic (~92% male, ~6% female)
- ✓ Turnout percentages within normal range (40–80%)
- ✓ Major national and regional parties present (INC, BJP, BSP, SP, etc.)
- ✓ No negative values in `Votes`, `Margin`, or `Electors`
- ✓ All constituency names properly formatted

---

## 3️⃣ Database Table: `election_loksabha_data`

### Table Structure Summary

| # | Column Name | Data Type | Description |
|---|------------|-----------|-------------|
| 1 | `State_Name` | TEXT | Name of the state or union territory |
| 2 | `Assembly_No` | INTEGER | Assembly number identifier for the constituency |
| 3 | `Constituency_No` | INTEGER | Numeric code assigned to each parliamentary constituency |
| 4 | `Year` | INTEGER | Election year (1991-2019) |
| 5 | `month` | FLOAT | Month when the election was held (nullable) |
| 6 | `Poll_No` | INTEGER | Polling phase number (multi-phase elections) |
| 7 | `DelimID` | INTEGER | Delimitation identifier (constituency boundary changes) |
| 8 | `Position` | INTEGER | Candidate's rank/position in that constituency (1 = Winner) |
| 9 | `Candidate` | TEXT | Full name of the candidate |
| 10 | `Sex` | TEXT | Gender of candidate (Male, Female, Other) |
| 11 | `Party` | TEXT | Political party abbreviation (e.g., INC, BJP, SP) |
| 12 | `Votes` | INTEGER | Total votes received by the candidate |
| 13 | `Candidate_Type` | TEXT | Type of candidate (General, SC, ST, etc.) |
| 14 | `Valid_Votes` | INTEGER | Total valid votes polled in that constituency |
| 15 | `Electors` | INTEGER | Total registered voters/electors in the constituency |
| 16 | `Constituency_Name` | TEXT | Name of the parliamentary constituency |
| 17 | `Constituency_Type` | TEXT | Reservation category (GEN, SC, ST) |
| 18 | `Sub_Region` | TEXT | Sub-regional classification within the state |
| 19 | `N_Cand` | INTEGER | Total number of candidates contested in that constituency |
| 20 | `Turnout_Percentage` | INTEGER | Voter turnout percentage ((Valid_Votes/Electors) × 100) |
| 21 | `Vote_Share_Percentage` | FLOAT | Candidate's vote share ((Votes/Valid_Votes) × 100) |
| 22 | `Deposit_Lost` | TEXT | Whether candidate lost election deposit (Yes/No) |
| 23 | `Margin` | INTEGER | Victory margin (difference between winner and runner-up votes) |
| 24 | `Margin_Percentage` | FLOAT | Margin as percentage of total valid votes |
| 25 | `ENOP` | FLOAT | Effective Number of Parties (measure of political competition) |
| 26 | `pid` | TEXT | Unique candidate-party identifier |
| 27 | `Party_Type_TCPD` | TEXT | Party classification by TCPD (National, State, Regional, Independent) |
| 28 | `Party_ID` | FLOAT | Numeric identifier for the political party |
| 29 | `last_poll` | BOOLEAN | Whether this was the candidate's last election contested |
| 30 | `Contested` | FLOAT | Number of elections this candidate has contested |
| 31 | `Last_Party` | TEXT | Party the candidate contested from in previous election |
| 32 | `Last_Party_ID` | FLOAT | Party ID from the previous election |
| 33 | `Last_Constituency_Name` | TEXT | Constituency name where candidate last contested |
| 34 | `Same_Constituency` | TEXT | Whether candidate contested from same constituency (Yes/No) |
| 35 | `Same_Party` | TEXT | Whether candidate contested from same party (Yes/No) |
| 36 | `No_Terms` | FLOAT | Number of terms won by the candidate |
| 37 | `Turncoat` | TEXT | Whether candidate switched parties (Yes/No) |
| 38 | `Incumbent` | TEXT | Whether candidate was the sitting MP (Yes/No) |
| 39 | `Recontest` | TEXT | Whether candidate re-contested after previous election (Yes/No) |
| 40 | `MyNeta_education` | TEXT | Educational qualification of candidate (from MyNeta database) |
| 41 | `TCPD_Prof_Main` | TEXT | Primary profession code (TCPD classification) |
| 42 | `TCPD_Prof_Main_Desc` | TEXT | Description of primary profession |
| 43 | `TCPD_Prof_Second` | TEXT | Secondary profession code (TCPD classification) |
| 44 | `TCPD_Prof_Second_Desc` | TEXT | Description of secondary profession |
| 45 | `Election_Type` | TEXT | Type of election (General Election, By-Election) |
| 46 | `Vote_Share_Calc` | FLOAT | **Derived**: Calculated vote share percentage for validation |
| 47 | `Is_Winner` | INTEGER | **Derived**: Binary flag (1 = Winner, 0 = Lost) |

---

## 4️⃣ Derived/Calculated Columns

These columns were added during preprocessing to enable efficient querying:

| Column | Calculation | Purpose |
|--------|------------|---------|
| `Vote_Share_Calc` | `(Votes / Valid_Votes) × 100` | Validate reported vote shares |
| `Is_Winner` | `IF Position = 1 THEN 1 ELSE 0` | Fast winner filtering |

---

## 5️⃣ Indexing Strategy

For optimal query performance, the following columns are indexed:

- **Primary Index**: `(Year, State_Name, Constituency_Name, Candidate)`
- **Secondary Indexes**: 
  - `Year` (time-series queries)
  - `Party` (party-wise aggregations)
  - `Is_Winner` (winner filtering)
  - `Constituency_Name` (constituency lookups)

---

## 6️⃣ Common Query Patterns

### Get Winners by Year and Party
```sql
SELECT * FROM election_loksabha_data
WHERE Year = 2019 AND Is_Winner = 1 AND Party = 'BJP';
```

### Calculate Party-wise Seat Share
```sql
SELECT Party, COUNT(*) as Seats
FROM election_loksabha_data
WHERE Year = 2019 AND Is_Winner = 1
GROUP BY Party
ORDER BY Seats DESC;
```

### Analyze Gender Representation Over Time
```sql
SELECT Year, Sex, COUNT(*) as Winners
FROM election_loksabha_data
WHERE Is_Winner = 1
GROUP BY Year, Sex
ORDER BY Year, Sex;
```

### Find Close Contests (Margin < 5%)
```sql
SELECT Year, State_Name, Constituency_Name, Candidate, Party, Margin_Percentage
FROM election_loksabha_data
WHERE Is_Winner = 1 AND Margin_Percentage < 5
ORDER BY Margin_Percentage ASC;
```

---

## 7️⃣ Data Quality Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Total Records | 63,100 | ✅ |
| Missing Values in Key Columns | < 0.1% | ✅ |
| Duplicate Records | 0 | ✅ |
| Invalid Turnout % | 0 (cleaned) | ✅ |
| Orphan Constituencies | 0 | ✅ |
| Year Coverage | 8 elections (1991-2019) | ✅ |

---

## 8️⃣ API Endpoints

The database is exposed through the following REST API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/elections` | GET | Fetch election data with filters |
| `/api/unique/:field` | GET | Get unique values for dropdowns |
| `/api/filters/all` | GET | Get all filter options |
| `/api/analytics/party-seats` | GET | Party-wise seat share |
| `/api/analytics/state-turnout` | GET | State-wise turnout data |
| `/api/analytics/gender-representation` | GET | Gender representation trends |
| `/api/analytics/top-parties` | GET | Top parties by vote share |
| `/api/analytics/margin-distribution` | GET | Margin distribution histogram |
| `/api/search` | GET | Search candidates/constituencies |
| `/api/ai/query` | POST | AI-powered natural language queries |
| `/api/health` | GET | Database health check |

---

## 9️⃣ Technology Stack

- **Database**: PostgreSQL 14+
- **Backend**: Node.js + Express
- **ORM**: pg (node-postgres)
- **Frontend**: React + Vite
- **Visualization**: D3.js, Chart.js
- **Deployment**: Firebase Functions (optional)

---

## 📝 Notes & Best Practices

1. **Performance**: Always filter by `Year` first for optimal query performance
2. **Vote Share**: Use `Vote_Share_Percentage` (pre-calculated) rather than computing on the fly
3. **Winners**: Filter using `Is_Winner = 1` rather than `Position = 1` (indexed column)
4. **Text Search**: Constituency and candidate names are case-insensitive searchable

---
