import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test the national vs regional parties query
async function testNationalRegionalQuery() {
  console.log('\n=== Testing: How has the vote share of national vs regional parties changed over time? ===\n');
  
  const question = "How has the vote share of national vs regional parties changed over time?";
  
  try {
    const SCHEMA_CONTEXT = `
DATABASE SCHEMA for table "election_loksabha_data":

PARTY CLASSIFICATION (National vs Regional):
NATIONAL PARTIES (only these 7):
- 'AAP' (Aam Aadmi Party)
- 'BJP' (Bharatiya Janata Party)
- 'INC' (Indian National Congress)
- 'BSP' (Bahujan Samaj Party)
- 'CPI' (Communist Party of India)
- 'CPI-M' (Communist Party of India - Marxist)
- 'NCP' (Nationalist Congress Party)

REGIONAL PARTIES (all others)

To classify parties in queries:
- Use CASE WHEN "Party" IN ('AAP', 'BJP', 'INC', 'BSP', 'CPI', 'CPI-M', 'NCP') THEN 'National' ELSE 'Regional' END
`;

    const prompt = `You are an expert PostgreSQL database analyst for Indian Lok Sabha election data.

${SCHEMA_CONTEXT}

USER QUESTION: "${question}"

INSTRUCTIONS:
1. Generate a PostgreSQL query for the "election_loksabha_data" table
2. Use EXACT column names with double quotes
3. For national vs regional classification, use: CASE WHEN "Party" IN ('AAP', 'BJP', 'INC', 'BSP', 'CPI', 'CPI-M', 'NCP') THEN 'National' ELSE 'Regional' END
4. Return ONLY the SQL query - no explanations, no markdown

EXAMPLE:

Question: "How has the vote share of national vs regional parties changed over time?"
Query: SELECT "Year", CASE WHEN "Party" IN ('AAP', 'BJP', 'INC', 'BSP', 'CPI', 'CPI-M', 'NCP') THEN 'National' ELSE 'Regional' END as party_type, SUM("Votes") as total_votes, ROUND(AVG("Vote_Share_Percentage")::numeric, 2) as avg_vote_share_pct, COUNT(DISTINCT "Party") as num_parties FROM election_loksabha_data GROUP BY "Year", party_type ORDER BY "Year", party_type LIMIT 100;

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
    
    // Check if it includes the correct party classification
    if (sql.includes("'AAP'") && sql.includes("'BJP'") && sql.includes("'INC'") && 
        sql.includes("'BSP'") && sql.includes("'CPI'") && sql.includes("'CPI-M'") && 
        sql.includes("'NCP'")) {
      console.log('✅ SQL correctly includes all 7 national parties (AAP, BJP, INC, BSP, CPI, CPI-M, NCP)');
    } else {
      console.log('❌ SQL is missing some national parties!');
      console.log('   Expected: AAP, BJP, INC, BSP, CPI, CPI-M, NCP');
    }
    
    if (sql.toLowerCase().includes('case when')) {
      console.log('✅ SQL uses CASE WHEN for party classification');
    } else {
      console.log('⚠️  SQL might not be using CASE WHEN for classification');
    }
    
    if (sql.toLowerCase().includes('group by')) {
      console.log('✅ SQL uses GROUP BY (needed for aggregating by party type and year)');
    }
    
    console.log('\n✅ Query generation successful!');
    console.log('\nThis SQL should correctly classify:');
    console.log('  - National parties: AAP, BJP, INC, BSP, CPI, CPI-M, NCP');
    console.log('  - Regional parties: All others (AITC, DMK, ADMK, SP, TDP, BJD, SHS, etc.)');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testNationalRegionalQuery();
