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
| 0 | `State_Name` | TEXT | Name of the state or union territory |
| 1 | `Assembly_No` | INTEGER | Assembly number identifier for the constituency |
| 2 | `Constituency_No` | INTEGER | Numeric code assigned to each parliamentary constituency |
| 3 | `Year` | INTEGER | Election year (1991-2019) |
| 4 | `month` | FLOAT | Month when the election was held (nullable) |
| 5 | `Poll_No` | INTEGER | Polling phase number (multi-phase elections) |
| 6 | `DelimID` | INTEGER | Delimitation identifier (constituency boundary changes) |
| 7 | `Position` | INTEGER | Candidate's rank/position in that constituency (1 = Winner) |
| 8 | `Candidate` | TEXT | Full name of the candidate |
| 9 | `Sex` | TEXT | Gender of candidate (Male, Female, Other) |
| 10 | `Party` | TEXT | Political party abbreviation (e.g., INC, BJP, SP) |
| 11 | `Votes` | INTEGER | Total votes received by the candidate |
| 12 | `Candidate_Type` | TEXT | Type of candidate (General, SC, ST, etc.) |
| 13 | `Valid_Votes` | INTEGER | Total valid votes polled in that constituency |
| 14 | `Electors` | INTEGER | Total registered voters/electors in the constituency |
| 15 | `Constituency_Name` | TEXT | Name of the parliamentary constituency |
| 16 | `Constituency_Type` | TEXT | Reservation category (GEN, SC, ST) |
| 17 | `Sub_Region` | TEXT | Sub-regional classification within the state |
| 18 | `N_Cand` | INTEGER | Total number of candidates contested in that constituency |
| 19 | `Turnout_Percentage` | INTEGER | Voter turnout percentage ((Valid_Votes/Electors) × 100) |
| 20 | `Vote_Share_Percentage` | FLOAT | Candidate's vote share ((Votes/Valid_Votes) × 100) |
| 21 | `Deposit_Lost` | TEXT | Whether candidate lost election deposit (Yes/No) |
| 22 | `Margin` | INTEGER | Victory margin (difference between winner and runner-up votes) |
| 23 | `Margin_Percentage` | FLOAT | Margin as percentage of total valid votes |
| 24 | `ENOP` | FLOAT | Effective Number of Parties (measure of political competition) |
| 25 | `pid` | TEXT | Unique candidate-party identifier |
| 26 | `Party_Type_TCPD` | TEXT | Party classification by TCPD (National, State, Regional, Independent) |
| 27 | `Party_ID` | FLOAT | Numeric identifier for the political party |
| 28 | `last_poll` | BOOLEAN | Whether this was the candidate's last election contested |
| 29 | `Contested` | FLOAT | Number of elections this candidate has contested |
| 30 | `Last_Party` | TEXT | Party the candidate contested from in previous election |
| 31 | `Last_Party_ID` | FLOAT | Party ID from the previous election |
| 32 | `Last_Constituency_Name` | TEXT | Constituency name where candidate last contested |
| 33 | `Same_Constituency` | TEXT | Whether candidate contested from same constituency (Yes/No) |
| 34 | `Same_Party` | TEXT | Whether candidate contested from same party (Yes/No) |
| 35 | `No_Terms` | FLOAT | Number of terms won by the candidate |
| 36 | `Turncoat` | TEXT | Whether candidate switched parties (Yes/No) |
| 37 | `Incumbent` | TEXT | Whether candidate was the sitting MP (Yes/No) |
| 38 | `Recontest` | TEXT | Whether candidate re-contested after previous election (Yes/No) |
| 39 | `MyNeta_education` | TEXT | Educational qualification of candidate (from MyNeta database) |
| 40 | `TCPD_Prof_Main` | TEXT | Primary profession code (TCPD classification) |
| 41 | `TCPD_Prof_Main_Desc` | TEXT | Description of primary profession |
| 42 | `TCPD_Prof_Second` | TEXT | Secondary profession code (TCPD classification) |
| 43 | `TCPD_Prof_Second_Desc` | TEXT | Description of secondary profession |
| 44 | `Election_Type` | TEXT | Type of election (General Election, By-Election) |
| 45 | `Vote_Share_Calc` | FLOAT | **Derived**: Calculated vote share percentage for validation |
| 46 | `Is_Winner` | INTEGER | **Derived**: Binary flag (1 = Winner, 0 = Lost) |

---

## 4️⃣ Detailed Column Descriptions

### 🗳️ Geographic & Administrative Columns

#### `State_Name` (TEXT)
Name of the Indian state or union territory where the constituency is located.
- **Examples**: "Uttar Pradesh", "Maharashtra", "Tamil Nadu", "Delhi"
- **Usage**: Filter elections by state, analyze state-wise voting patterns
- **Data Quality**: Standardized state names, no abbreviations

#### `Constituency_Name` (TEXT)
Official name of the parliamentary (Lok Sabha) constituency.
- **Examples**: "Amethi", "Varanasi", "Mumbai North", "Chennai South"
- **Total Constituencies**: ~543 per election (varies slightly due to delimitation)
- **Usage**: Track constituency-level results, identify key battleground seats

#### `Constituency_No` (INTEGER)
Unique numeric code assigned to each constituency within a state.
- **Range**: Typically 1-80 (varies by state size)
- **Purpose**: Database indexing and sorting

#### `Assembly_No` (INTEGER)
Assembly number identifier, links to state assembly constituencies.
- **Note**: One Lok Sabha constituency typically comprises multiple assembly segments
- **Usage**: Connect parliamentary and state assembly election data

#### `Sub_Region` (TEXT)
Sub-regional or cultural classification within the state.
- **Examples**: "Western UP", "Vidarbha", "North Bengal"
- **Usage**: Analyze regional political trends within larger states

---

### 📅 Temporal Columns

#### `Year` (INTEGER)
Election year when the voting took place.
- **Valid Values**: 1991, 1996, 1998, 1999, 2004, 2009, 2014, 2019
- **Usage**: Primary filter for time-series analysis, trend tracking
- **Indexed**: Yes (critical for query performance)

#### `month` (FLOAT)
Month when the polling occurred (some elections span multiple months).
- **Range**: 1-12 (nullable for missing data)
- **Usage**: Analyze seasonal voting patterns

#### `Poll_No` (INTEGER)
Polling phase number (Indian elections often occur in 5-7 phases).
- **Range**: 1-7
- **Purpose**: Track multi-phase election logistics

---

### 👤 Candidate Columns

#### `Candidate` (TEXT)
Full name of the candidate who contested the election.
- **Format**: Standardized, title case (e.g., "Rahul Gandhi", "Narendra Modi")
- **Usage**: Search, candidate tracking across elections
- **Data Quality**: Cleaned for duplicates and spelling variations

#### `Sex` (TEXT)
Gender of the candidate.
- **Values**: "Male", "Female", "Other", "Unknown"
- **Distribution**: ~92% Male, ~6% Female (reflects gender representation issues)
- **Usage**: Gender representation analysis, diversity metrics

#### `Candidate_Type` (TEXT)
Social category of the candidate (linked to India's reservation system).
- **Values**: "GEN" (General), "SC" (Scheduled Caste), "ST" (Scheduled Tribe)
- **Usage**: Analyze representation of marginalized communities

#### `MyNeta_education` (TEXT)
Educational qualification of the candidate (sourced from MyNeta.info database).
- **Examples**: "Graduate", "Post Graduate", "12th Pass", "Doctorate", "Illiterate"
- **Usage**: Study correlation between education and electoral success
- **Coverage**: Available for recent elections (2004 onwards)

---

### 🎯 Party & Political Columns

#### `Party` (TEXT)
Abbreviation of the political party the candidate represented.
- **Examples**: 
  - National: "INC", "BJP", "CPI", "CPIM"
  - Regional: "SP", "BSP", "TMC", "DMK", "AITC", "TDP", "BJD"
  - Independent: "IND"
- **Total Unique**: 100+ parties across all elections
- **Usage**: Party-wise seat share, alliance analysis

#### `Party_Type_TCPD` (TEXT)
Classification of party type by Trivedi Centre for Political Data (TCPD).
- **Categories**: 
  - "National" (recognized in 4+ states)
  - "State" (recognized in 1 state)
  - "Regional" (localized parties)
  - "Independent"
- **Usage**: Analyze national vs regional party performance

#### `Party_ID` (FLOAT)
Unique numeric identifier assigned to each political party.
- **Purpose**: Database joins, party tracking across name changes

#### `Last_Party` (TEXT)
Party from which the candidate contested in the previous election.
- **Usage**: Track party loyalty, identify turncoats

#### `Same_Party` (TEXT)
Flag indicating if candidate contested from same party as previous election.
- **Values**: "Yes", "No", NULL
- **Usage**: Measure party loyalty and stability

#### `Turncoat` (TEXT)
Indicates if candidate switched parties between elections.
- **Values**: "Yes", "No"
- **Usage**: Study anti-defection patterns

---

### 📊 Vote & Performance Columns

#### `Votes` (INTEGER)
Total votes received by the candidate in that constituency.
- **Range**: 0 to 1,000,000+ (varies by constituency size)
- **Usage**: Calculate vote shares, margins, rankings
- **Indexed**: Yes (used in aggregations)

#### `Valid_Votes` (INTEGER)
Total valid votes polled in that constituency (excludes invalid/NOTA).
- **Purpose**: Denominator for vote share calculations
- **Relationship**: Sum of all candidate votes in that constituency

#### `Vote_Share_Percentage` (FLOAT)
Percentage of valid votes received by the candidate.
- **Formula**: `(Votes / Valid_Votes) × 100`
- **Range**: 0-100%
- **Usage**: Compare candidate performance across constituencies

#### `Vote_Share_Calc` (FLOAT) ⭐ *Derived Column*
Recalculated vote share for validation and data quality checks.
- **Purpose**: Cross-verify reported vote share percentages
- **Usage**: Data integrity checks

#### `Position` (INTEGER)
Rank of the candidate in that constituency (based on votes).
- **Values**: 1 = Winner, 2 = Runner-up, 3+ = Lost
- **Usage**: Filter winners, analyze competitive races

#### `Is_Winner` (INTEGER) ⭐ *Derived Column*
Binary flag indicating election outcome.
- **Values**: 
  - `1` = Won the seat (Position = 1)
  - `0` = Lost the election
- **Usage**: Quick filtering of winners, seat share calculations

#### `Margin` (INTEGER)
Absolute vote difference between winner and runner-up.
- **Formula**: `Votes(Winner) - Votes(Runner-up)`
- **Range**: 0 to 500,000+
- **Usage**: Identify close contests, safe seats

#### `Margin_Percentage` (FLOAT)
Margin expressed as percentage of total valid votes.
- **Formula**: `(Margin / Valid_Votes) × 100`
- **Range**: 0-100%
- **Usage**: Normalize margins across different constituency sizes

#### `Deposit_Lost` (TEXT)
Indicates if candidate lost their election security deposit.
- **Rule**: Deposit lost if vote share < 16.67% (1/6th of valid votes)
- **Values**: "Yes", "No"
- **Usage**: Filter out fringe candidates, analyze serious contenders

---

### 📈 Electoral Metrics Columns

#### `Electors` (INTEGER)
Total number of registered voters in the constituency.
- **Range**: 500,000 to 2,000,000+ (constituency size varies)
- **Usage**: Calculate turnout, normalize vote counts

#### `Turnout_Percentage` (INTEGER)
Voter turnout rate for that constituency.
- **Formula**: `(Valid_Votes / Electors) × 100`
- **Range**: 40-80% (cleaned to remove anomalies > 100%)
- **Usage**: Study voter participation, engagement levels

#### `N_Cand` (INTEGER)
Total number of candidates who contested in that constituency.
- **Range**: 2-50+ (varies widely)
- **Usage**: Measure electoral competition, fragmentation

#### `ENOP` (FLOAT)
Effective Number of Parties - a measure of political competition.
- **Formula**: Complex calculation based on vote share distribution
- **Range**: 1.0 (single party dominates) to 5+ (highly fragmented)
- **Usage**: Political science analysis of party system fragmentation

---

### 🏛️ Constituency Classification Columns

#### `Constituency_Type` (TEXT)
Reservation category of the constituency (per Indian Constitution).
- **Values**: 
  - "GEN" = General (unreserved)
  - "SC" = Reserved for Scheduled Castes
  - "ST" = Reserved for Scheduled Tribes
- **Distribution**: ~84 SC + 47 ST reserved seats (out of 543)
- **Usage**: Analyze reserved vs unreserved seat dynamics

#### `DelimID` (INTEGER)
Delimitation identifier tracking boundary changes.
- **Purpose**: Constituencies are redrawn periodically (delimitation)
- **Usage**: Account for constituency boundary changes in time-series analysis

---

### 🔄 Candidate History Columns

#### `Contested` (FLOAT)
Total number of elections this candidate has contested (lifetime).
- **Range**: 1 to 10+
- **Usage**: Identify veteran politicians vs first-timers

#### `No_Terms` (FLOAT)
Number of times the candidate has won and served as MP.
- **Range**: 0 (never won) to 10+ (multi-term MPs)
- **Usage**: Experience analysis, anti-incumbency studies

#### `Incumbent` (TEXT)
Whether the candidate was the sitting MP from that constituency.
- **Values**: "Yes", "No"
- **Usage**: Study incumbency advantage/disadvantage

#### `Recontest` (TEXT)
Whether the candidate re-contested after the previous election.
- **Values**: "Yes", "No"
- **Usage**: Measure political persistence and party loyalty

#### `last_poll` (BOOLEAN)
Flag indicating if this was the candidate's final election.
- **Values**: `TRUE`, `FALSE`
- **Usage**: Track political retirements

#### `Last_Constituency_Name` (TEXT)
Name of the constituency where the candidate last contested.
- **Usage**: Track candidate mobility across constituencies

#### `Same_Constituency` (TEXT)
Whether the candidate contested from the same constituency as before.
- **Values**: "Yes", "No"
- **Usage**: Measure geographic loyalty vs "parachute" candidates

---

### 💼 Profession Columns (TCPD Classification)

#### `TCPD_Prof_Main` (TEXT)
Code for candidate's primary profession (TCPD standardized).
- **Examples**: "POL" (Politics), "BUS" (Business), "LAW" (Lawyer), "EDU" (Education)
- **Usage**: Occupational background analysis

#### `TCPD_Prof_Main_Desc` (TEXT)
Full description of the primary profession.
- **Examples**: "Politician", "Businessman", "Lawyer", "Social Worker"

#### `TCPD_Prof_Second` (TEXT)
Code for candidate's secondary profession.
- **Usage**: Multi-professional backgrounds

#### `TCPD_Prof_Second_Desc` (TEXT)
Full description of the secondary profession.

---

### 🆔 Identifier Columns

#### `pid` (TEXT)
Unique candidate-party identifier combining candidate and party information.
- **Format**: Custom string (e.g., "RAHUL_GANDHI_INC_2019")
- **Usage**: Track unique candidate-party combinations

#### `Election_Type` (TEXT)
Type of election conducted.
- **Values**: 
  - "GE" (General Election)
  - "BE" (By-Election)
- **Usage**: Filter main elections vs by-elections

---

## 5️⃣ Derived/Calculated Columns

These columns were added during preprocessing to enable efficient querying:

| Column | Calculation | Purpose |
|--------|------------|---------|
| `Vote_Share_Calc` | `(Votes / Valid_Votes) × 100` | Validate reported vote shares |
| `Is_Winner` | `IF Position = 1 THEN 1 ELSE 0` | Fast winner filtering |

---

## 6️⃣ Indexing Strategy

For optimal query performance, the following columns are indexed:

- **Primary Index**: `(Year, State_Name, Constituency_Name, Candidate)`
- **Secondary Indexes**: 
  - `Year` (time-series queries)
  - `Party` (party-wise aggregations)
  - `Is_Winner` (winner filtering)
  - `Constituency_Name` (constituency lookups)

---

## 7️⃣ Common Query Patterns

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

## 8️⃣ Data Quality Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Total Records | 63,100 | ✅ |
| Missing Values in Key Columns | < 0.1% | ✅ |
| Duplicate Records | 0 | ✅ |
| Invalid Turnout % | 0 (cleaned) | ✅ |
| Orphan Constituencies | 0 | ✅ |
| Year Coverage | 8 elections (1991-2019) | ✅ |

---

## 9️⃣ API Endpoints

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

## 🔟 Technology Stack

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
