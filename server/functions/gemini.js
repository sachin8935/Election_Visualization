import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "./db.js";
import pg from 'pg';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Database schema and examples for better SQL generation
const SCHEMA_CONTEXT = `
DATABASE SCHEMA for table "election_loksabha_data":

Key Columns (with data types and examples):
- "Year" (bigint): Available years: 1991, 1996, 1998, 1999, 2004, 2009, 2014, 2019
- "State_Name" (text): Examples: 'Maharashtra', 'Uttar_Pradesh', 'Karnataka', 'Tamil_Nadu'
  Note: Uses underscores (e.g., 'Uttar_Pradesh' not 'Uttar Pradesh')
- "Constituency_Name" (text): Examples: 'NANDURBAR', 'MUMBAI NORTH', 'DELHI SOUTH'
- "Party" (text): Examples: 'BJP', 'INC', 'AITC', 'DMK', 'BSP', 'SP', 'TDP'
- "Candidate" (text): Full name of the candidate
- "Sex" (text): 'Male', 'Female', 'Unknown', 'O'
- "Votes" (bigint): Number of votes received
- "Is_Winner" (bigint): 1 for winner, 0 for loser
- "Turnout_Percentage" (bigint): Voter turnout percentage (0-100)
- "Vote_Share_Percentage" (double precision): Vote share percentage for candidate
- "Margin" (bigint): Victory margin in votes
- "Margin_Percentage" (double precision): Victory margin as percentage
- "Electors" (bigint): Total number of electors
- "Valid_Votes" (bigint): Total valid votes cast
- "Party_Type_TCPD" (text): 'National Party', 'State Party', 'Local Party'
- "MyNeta_education" (text): Education level of candidate
- "Position" (bigint): Rank of candidate (1 = winner, 2 = runner-up, etc.)

IMPORTANT NOTES:
1. State names use underscores: 'Andhra_Pradesh', 'West_Bengal', 'Jammu_&_Kashmir'
2. To count seats won by a party: COUNT(*) WHERE "Is_Winner" = 1 AND "Party" = 'BJP'
3. To find winner in a constituency: WHERE "Is_Winner" = 1
4. To calculate turnout: Use "Turnout_Percentage" column directly (already calculated)
5. Each row represents ONE CANDIDATE in an election, not a constituency
6. Multiple rows per constituency (one for each candidate)
7. Latest election year is 2019

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
- 'AITC' (All India Trinamool Congress) - West Bengal
- 'DMK' (Dravida Munnetra Kazhagam) - Tamil Nadu
- 'ADMK' (All India Anna Dravida Munnetra Kazhagam) - Tamil Nadu
- 'SP' (Samajwadi Party) - Uttar Pradesh
- 'TDP' (Telugu Desam Party) - Andhra Pradesh
- 'BJD' (Biju Janata Dal) - Odisha
- 'SHS' (Shiv Sena) - Maharashtra
- 'JD-U' (Janata Dal United) - Bihar
- And many others

To classify parties in queries:
- Use CASE WHEN "Party" IN ('AAP', 'BJP', 'INC', 'BSP', 'CPI', 'CPI-M', 'NCP') THEN 'National' ELSE 'Regional' END

COMMON QUERY PATTERNS:

Seats won by party:
  SELECT "Party", COUNT(*) as seats 
  FROM election_loksabha_data 
  WHERE "Is_Winner" = 1 AND "Year" = 2019 
  GROUP BY "Party" ORDER BY seats DESC;

Voter turnout in a state:
  SELECT AVG("Turnout_Percentage") as avg_turnout
  FROM election_loksabha_data
  WHERE "State_Name" = 'Maharashtra' AND "Year" = 2014
  GROUP BY "State_Name", "Year";

Highest turnout state:
  SELECT "State_Name", AVG("Turnout_Percentage") as avg_turnout
  FROM election_loksabha_data
  WHERE "Year" = 2019
  GROUP BY "State_Name"
  ORDER BY avg_turnout DESC LIMIT 1;

Seat changes between elections:
  WITH seats_2014 AS (
    SELECT "Party", COUNT(*) as seats_2014
    FROM election_loksabha_data
    WHERE "Year" = 2014 AND "Is_Winner" = 1
    GROUP BY "Party"
  ), seats_2019 AS (
    SELECT "Party", COUNT(*) as seats_2019
    FROM election_loksabha_data
    WHERE "Year" = 2019 AND "Is_Winner" = 1
    GROUP BY "Party"
  )
  SELECT 
    COALESCE(a."Party", b."Party") as "Party",
    COALESCE(seats_2014, 0) as seats_2014,
    COALESCE(seats_2019, 0) as seats_2019,
    COALESCE(seats_2019, 0) - COALESCE(seats_2014, 0) as change
  FROM seats_2014 a FULL OUTER JOIN seats_2019 b ON a."Party" = b."Party"
  ORDER BY ABS(COALESCE(seats_2019, 0) - COALESCE(seats_2014, 0)) DESC;

Women candidates:
  SELECT COUNT(*) as total_women
  FROM election_loksabha_data
  WHERE "Sex" = 'Female' AND "Year" = 2019;

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

IMPORTANT SQL RULES:
- NEVER use window functions (ROW_NUMBER, RANK, LAG, LEAD) in WHERE clause
- Use CTEs (WITH clause) for comparing data between different years
- For consecutive elections, manually specify the years (e.g., 2014 and 2019)
- Window functions can only be used in SELECT, not in WHERE or JOIN conditions
`;

// Validate SQL syntax using pg-query-parser approach
function validateSQL(sql) {
  try {
    // Basic syntax checks
    const trimmed = sql.trim();
    
    if (!trimmed) {
      return { valid: false, error: 'Empty query' };
    }
    
    // Check for basic SQL structure
    if (!trimmed.toLowerCase().startsWith('select') && 
        !trimmed.toLowerCase().startsWith('with')) {
      return { valid: false, error: 'Query must start with SELECT or WITH' };
    }
    
    // Check for common SQL keywords that should exist
    const hasSelect = /\bselect\b/i.test(trimmed);
    if (!hasSelect) {
      return { valid: false, error: 'Query missing SELECT keyword' };
    }
    
    // Check if table name is correct
    if (!trimmed.includes('election_loksabha_data')) {
      return { valid: false, error: 'Query must reference table "election_loksabha_data"' };
    }
    
    // For WITH queries, validate structure
    if (trimmed.toLowerCase().startsWith('with')) {
      // Check for AS keyword
      if (!/\bas\b/i.test(trimmed)) {
        return { valid: false, error: 'WITH clause missing AS keyword' };
      }
      
      // Must have parentheses for CTE definition
      if (!trimmed.includes('(') || !trimmed.includes(')')) {
        return { valid: false, error: 'WITH clause missing parentheses' };
      }
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Security: Validate SQL query to prevent dangerous operations
function isSafeQuery(sql) {
  const sqlLower = sql.toLowerCase().trim();
  
  // Remove comments and normalize whitespace
  const cleanSql = sqlLower
    .replace(/--.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Dangerous keywords that modify data
  const dangerousKeywords = [
    'insert', 'update', 'delete', 'drop', 'truncate', 
    'alter', 'create', 'replace', 'merge', 'grant', 
    'revoke', 'exec', 'execute', 'call', 'backup',
    'restore', 'rename', 'commit', 'rollback'
  ];
  
  // Check if query contains dangerous keywords
  for (const keyword of dangerousKeywords) {
    const pattern = new RegExp(`\\b${keyword}\\b`, 'i');
    if (pattern.test(cleanSql)) {
      return {
        safe: false,
        reason: `Query contains forbidden operation: ${keyword.toUpperCase()}`
      };
    }
  }
  
  // Must start with SELECT
  if (!cleanSql.startsWith('select') && !cleanSql.startsWith('with')) {
    return {
      safe: false,
      reason: 'Only SELECT queries are allowed'
    };
  }
  
  // Check for semicolons (potential query chaining)
  const semicolonCount = (cleanSql.match(/;/g) || []).length;
  if (semicolonCount > 1 || (semicolonCount === 1 && !cleanSql.endsWith(';'))) {
    return {
      safe: false,
      reason: 'Multiple queries or query chaining not allowed'
    };
  }
  
  return { safe: true };
}

// Clean SQL response from Gemini (remove markdown formatting)
function cleanSQLResponse(text) {
  let cleaned = text.trim();
  
  // Remove markdown code blocks
  cleaned = cleaned.replace(/```sql\n/gi, '');
  cleaned = cleaned.replace(/```\n/g, '');
  cleaned = cleaned.replace(/```/g, '');
  
  // Remove any text before WITH or SELECT
  const withIndex = cleaned.search(/\bWITH\b/i);
  const selectIndex = cleaned.search(/\bSELECT\b/i);
  
  if (withIndex >= 0 && (selectIndex < 0 || withIndex < selectIndex)) {
    cleaned = cleaned.substring(withIndex);
  } else if (selectIndex >= 0) {
    cleaned = cleaned.substring(selectIndex);
  }
  
  // Remove any trailing text after the semicolon or after the query ends
  const semicolonIndex = cleaned.lastIndexOf(';');
  if (semicolonIndex >= 0) {
    cleaned = cleaned.substring(0, semicolonIndex + 1);
  }
  
  return cleaned.trim();
}

async function askGeminiForSQL(question) {
  const prompt = `You are an expert PostgreSQL database analyst for Indian Lok Sabha election data.

${SCHEMA_CONTEXT}

USER QUESTION: "${question}"

INSTRUCTIONS:
1. Generate a PostgreSQL query for the "election_loksabha_data" table
2. Use EXACT column names with double quotes (e.g., "Year", "State_Name")
3. State names MUST use underscores (e.g., 'Maharashtra', 'Uttar_Pradesh')
4. Remember: Each row is a CANDIDATE, not a constituency
5. To count seats won: WHERE "Is_Winner" = 1
6. For latest election, use Year = 2019
7. For "highest" or "most", use ORDER BY ... DESC LIMIT
8. For comparisons between years, use CTEs (WITH clause) - NEVER use window functions in WHERE
9. For "consecutive elections", use the two most recent years: 2014 and 2019
10. NEVER use window functions (LAG, LEAD, ROW_NUMBER, RANK) in WHERE or JOIN conditions
11. ALWAYS add LIMIT clause (max 100 rows)
12. Return ONLY the SQL query - no explanations, no markdown

EXAMPLES:

Question: "Which party won the most seats in 2019?"
Query: SELECT "Party", COUNT(*) as seats FROM election_loksabha_data WHERE "Is_Winner" = 1 AND "Year" = 2019 GROUP BY "Party" ORDER BY seats DESC LIMIT 10;

Question: "What was the voter turnout in Maharashtra in 2014?"
Query: SELECT "State_Name", "Year", AVG("Turnout_Percentage") as avg_turnout FROM election_loksabha_data WHERE "State_Name" = 'Maharashtra' AND "Year" = 2014 GROUP BY "State_Name", "Year";

Question: "Which state had the highest voter turnout in 2019?"
Query: SELECT "State_Name", AVG("Turnout_Percentage") as avg_turnout FROM election_loksabha_data WHERE "Year" = 2019 GROUP BY "State_Name" ORDER BY avg_turnout DESC LIMIT 1;

Question: "Which party gained or lost the most seats between 2014 and 2019?"
Query: WITH seats_2014 AS (SELECT "Party", COUNT(*) as seats FROM election_loksabha_data WHERE "Year" = 2014 AND "Is_Winner" = 1 GROUP BY "Party"), seats_2019 AS (SELECT "Party", COUNT(*) as seats FROM election_loksabha_data WHERE "Year" = 2019 AND "Is_Winner" = 1 GROUP BY "Party") SELECT COALESCE(a."Party", b."Party") as "Party", COALESCE(a.seats, 0) as seats_2014, COALESCE(b.seats, 0) as seats_2019, COALESCE(b.seats, 0) - COALESCE(a.seats, 0) as seat_change FROM seats_2014 a FULL OUTER JOIN seats_2019 b ON a."Party" = b."Party" ORDER BY ABS(COALESCE(b.seats, 0) - COALESCE(a.seats, 0)) DESC LIMIT 10;

Question: "Which party gained or lost the most seats between consecutive elections?"
Query: WITH seats_2014 AS (SELECT "Party", COUNT(*) as seats FROM election_loksabha_data WHERE "Year" = 2014 AND "Is_Winner" = 1 GROUP BY "Party"), seats_2019 AS (SELECT "Party", COUNT(*) as seats FROM election_loksabha_data WHERE "Year" = 2019 AND "Is_Winner" = 1 GROUP BY "Party") SELECT COALESCE(a."Party", b."Party") as "Party", COALESCE(a.seats, 0) as seats_2014, COALESCE(b.seats, 0) as seats_2019, COALESCE(b.seats, 0) - COALESCE(a.seats, 0) as seat_change FROM seats_2014 a FULL OUTER JOIN seats_2019 b ON a."Party" = b."Party" ORDER BY ABS(COALESCE(b.seats, 0) - COALESCE(a.seats, 0)) DESC LIMIT 10;

Question: "How has the vote share of national vs regional parties changed over time?"
Query: SELECT "Year", CASE WHEN "Party" IN ('AAP', 'BJP', 'INC', 'BSP', 'CPI', 'CPI-M', 'NCP') THEN 'National' ELSE 'Regional' END as party_type, SUM("Votes") as total_votes, ROUND(AVG("Vote_Share_Percentage")::numeric, 2) as avg_vote_share_pct, COUNT(DISTINCT "Party") as num_parties FROM election_loksabha_data GROUP BY "Year", party_type ORDER BY "Year", party_type LIMIT 100;

Now generate the SQL query for the user's question:`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const sqlText = result.response.text();
  
  return cleanSQLResponse(sqlText);
}

export const geminiquery = async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Question is required',
      success: false 
    });
  }

  console.log('=== AI Query Request ===');
  console.log('User question:', query);

  try {
    // Step 1: Generate SQL from natural language
    console.log('Step 1: Generating SQL with Gemini...');
    const sql = await askGeminiForSQL(query);
    console.log("Generated SQL:", sql);

    // Step 2: Security validation
    console.log('Step 2: Validating SQL safety...');
    const safetyCheck = isSafeQuery(sql);
    if (!safetyCheck.safe) {
      console.log('❌ Query blocked:', safetyCheck.reason);
      return res.status(403).json({
        error: 'Unsafe query detected',
        reason: safetyCheck.reason,
        success: false,
        sql // Show what was generated for transparency
      });
    }
    console.log('✅ Query is safe');

    // Step 3: Validate SQL syntax
    console.log('Step 3: Validating SQL syntax...');
    const syntaxCheck = validateSQL(sql);
    if (!syntaxCheck.valid) {
      console.log('❌ Invalid SQL syntax:', syntaxCheck.error);
      return res.status(400).json({
        error: 'Invalid SQL syntax',
        reason: syntaxCheck.error,
        success: false,
        sql
      });
    }
    console.log('✅ SQL syntax is valid');

    // Step 4: Execute query
    console.log('Step 4: Executing query...');
    const dbResult = await pool.query(sql);
    const rows = dbResult.rows;
    console.log(`✅ Query executed successfully. Rows returned: ${rows.length}`);

    // Step 5: Generate natural language summary
    console.log('Step 5: Generating natural language summary...');
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const summaryPrompt = `
The user asked: "${query}"

Here are the SQL query results (showing first 10 rows):
${JSON.stringify(rows.slice(0, 10), null, 2)}

Total rows returned: ${rows.length}

Provide a clear, concise answer to the user's question based on these results. 
Format your response in 2-3 paragraphs maximum.
If there are interesting patterns or insights, highlight them.`;

    const summaryResponse = await model.generateContent(summaryPrompt);
    const answer = summaryResponse.response.text().trim();
    console.log('✅ Summary generated successfully');

    console.log('=== Query Complete ===\n');
    
    res.json({
      success: true,
      question: query,
      sql,
      result: rows.slice(0, 100), // Limit results sent to frontend
      totalRows: rows.length,
      answer,
    });
  } catch (err) {
    console.error("❌ Error in geminiquery:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process query',
      message: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};