import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'sachin8935',
  host: 'localhost',
  database: 'election',
  password: 'sa12345',
  port: 5432,
});

async function checkData() {
  try {
    // Check Narendra Modi
    const modi = await pool.query(`
      SELECT 
        "Candidate",
        "Party",
        "Constituency_Name",
        "State_Name",
        "Year",
        "Votes",
        "Vote_Share_Percentage",
        "Is_Winner",
        "Position"
      FROM election_loksabha_data
      WHERE "Candidate" ILIKE '%narendra%modi%'
        AND "Year" = 2019
        AND "Constituency_Name" = 'VARANASI'
    `);
    
    console.log('\n=== Narendra Modi - Varanasi 2019 ===');
    console.table(modi.rows);
    
    // Check all Varanasi candidates
    const all = await pool.query(`
      SELECT 
        "Candidate",
        "Party",
        "Vote_Share_Percentage",
        "Is_Winner",
        "Position"
      FROM election_loksabha_data
      WHERE "Constituency_Name" = 'VARANASI'
        AND "Year" = 2019
      ORDER BY "Vote_Share_Percentage" DESC
      LIMIT 10
    `);
    
    console.log('\n=== All Candidates Varanasi 2019 ===');
    console.table(all.rows);
    
    await pool.end();
  } catch (err) {
    console.error('Error:', err);
    await pool.end();
  }
}

checkData();
