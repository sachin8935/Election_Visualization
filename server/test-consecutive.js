import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "./db.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test the consecutive elections query
async function testConsecutiveElections() {
  console.log('\n=== Testing: Which party gained or lost the most seats between consecutive elections? ===\n');
  
  const question = "Which party gained or lost the most seats between consecutive elections?";
  
  try {
    // Read the actual prompt from gemini.js
    const SCHEMA_CONTEXT = `
DATABASE SCHEMA for table "election_loksabha_data":

Key Columns (with data types and examples):
- "Year" (bigint): Available years: 1991, 1996, 1998, 1999, 2004, 2009, 2014, 2019
- "State_Name" (text): Examples: 'Maharashtra', 'Uttar_Pradesh', 'Karnataka', 'Tamil_Nadu'
- "Party" (text): Examples: 'BJP', 'INC', 'AITC', 'DMK', 'BSP', 'SP', 'TDP'
- "Is_Winner" (bigint): 1 for winner, 0 for loser

IMPORTANT SQL RULES:
- NEVER use window functions (ROW_NUMBER, RANK, LAG, LEAD) in WHERE clause
- Use CTEs (WITH clause) for comparing data between different years
- For consecutive elections, manually specify the years (e.g., 2014 and 2019)
- Window functions can only be used in SELECT, not in WHERE or JOIN conditions
`;

    const prompt = `You are an expert PostgreSQL database analyst for Indian Lok Sabha election data.

${SCHEMA_CONTEXT}

USER QUESTION: "${question}"

INSTRUCTIONS:
1. Generate a PostgreSQL query for the "election_loksabha_data" table
2. Use EXACT column names with double quotes (e.g., "Year", "Party")
3. For comparisons between years, use CTEs (WITH clause) - NEVER use window functions in WHERE
4. For "consecutive elections", use the two most recent years: 2014 and 2019
5. NEVER use window functions (LAG, LEAD, ROW_NUMBER, RANK) in WHERE or JOIN conditions
6. ALWAYS add LIMIT clause (max 100 rows)
7. Return ONLY the SQL query - no explanations, no markdown

EXAMPLES:

Question: "Which party gained or lost the most seats between consecutive elections?"
Query: WITH seats_2014 AS (SELECT "Party", COUNT(*) as seats FROM election_loksabha_data WHERE "Year" = 2014 AND "Is_Winner" = 1 GROUP BY "Party"), seats_2019 AS (SELECT "Party", COUNT(*) as seats FROM election_loksabha_data WHERE "Year" = 2019 AND "Is_Winner" = 1 GROUP BY "Party") SELECT COALESCE(a."Party", b."Party") as "Party", COALESCE(a.seats, 0) as seats_2014, COALESCE(b.seats, 0) as seats_2019, COALESCE(b.seats, 0) - COALESCE(a.seats, 0) as seat_change FROM seats_2014 a FULL OUTER JOIN seats_2019 b ON a."Party" = b."Party" ORDER BY ABS(COALESCE(b.seats, 0) - COALESCE(a.seats, 0)) DESC LIMIT 10;

Now generate the SQL query for the user's question:`;

    console.log('Step 1: Asking Gemini to generate SQL...');
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let sql = result.response.text().trim();
    
    // Clean the SQL
    sql = sql.replace(/```sql\n/gi, '');
    sql = sql.replace(/```\n/g, '');
    sql = sql.replace(/```/g, '');
    
    const withIndex = sql.search(/\bWITH\b/i);
    const selectIndex = sql.search(/\bSELECT\b/i);
    
    if (withIndex >= 0 && (selectIndex < 0 || withIndex < selectIndex)) {
      sql = sql.substring(withIndex);
    } else if (selectIndex >= 0) {
      sql = sql.substring(selectIndex);
    }
    
    const semicolonIndex = sql.lastIndexOf(';');
    if (semicolonIndex >= 0) {
      sql = sql.substring(0, semicolonIndex + 1);
    }
    
    console.log('\n📝 Generated SQL:');
    console.log(sql);
    console.log('\n');
    
    // Check for window functions in WHERE
    const lowerSql = sql.toLowerCase();
    const hasWindowFunction = /\b(row_number|rank|dense_rank|lag|lead|first_value|last_value)\s*\(/i.test(sql);
    const hasWhereClause = /\bwhere\b/i.test(sql);
    
    if (hasWindowFunction) {
      console.log('⚠️  SQL contains window functions');
      
      // Check if window function is in WHERE (this would cause the error)
      const whereMatch = lowerSql.match(/where\s+.+?(?:group by|order by|limit|$)/s);
      if (whereMatch) {
        const whereClause = whereMatch[0];
        if (/\b(row_number|rank|dense_rank|lag|lead)\s*\(/i.test(whereClause)) {
          console.log('❌ ERROR: Window function found in WHERE clause - this will fail!');
          console.log('   WHERE clause:', whereClause);
          return;
        }
      }
    }
    
    console.log('Step 2: Executing SQL query...');
    const dbResult = await pool.query(sql);
    
    console.log('\n✅ Query executed successfully!');
    console.log(`   Rows returned: ${dbResult.rows.length}`);
    console.log('\n📊 Results (top 10):');
    console.log(JSON.stringify(dbResult.rows.slice(0, 10), null, 2));
    
    // Show top 3 gainers and losers
    console.log('\n🎯 Summary:');
    const sorted = [...dbResult.rows].sort((a, b) => b.seat_change - a.seat_change);
    
    console.log('\nTop 3 Seat Gainers:');
    sorted.slice(0, 3).forEach((row, i) => {
      console.log(`  ${i + 1}. ${row.Party}: +${row.seat_change} seats (${row.seats_2014} → ${row.seats_2019})`);
    });
    
    console.log('\nTop 3 Seat Losers:');
    sorted.slice(-3).reverse().forEach((row, i) => {
      console.log(`  ${i + 1}. ${row.Party}: ${row.seat_change} seats (${row.seats_2014} → ${row.seats_2019})`);
    });
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Full error:', error);
    if (error.message.includes('window function')) {
      console.error('\n💡 This is the window function error! The SQL generated is using window functions incorrectly.');
    }
  } finally {
    await pool.end();
  }
}

testConsecutiveElections();
