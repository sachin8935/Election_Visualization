import 'dotenv/config';
import pool from './db.js';

async function getSampleData() {
  try {
    // Get column names and types
    const columnsQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'election_loksabha_data'
      ORDER BY ordinal_position;
    `;
    const columns = await pool.query(columnsQuery);
    
    console.log('📋 Table Schema:\n');
    columns.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });
    
    // Get sample rows
    const sampleQuery = `
      SELECT * FROM election_loksabha_data 
      WHERE "Year" = 2019 AND "State_Name" = 'Maharashtra' 
      LIMIT 3;
    `;
    const sample = await pool.query(sampleQuery);
    
    console.log('\n\n📊 Sample Data (2019 Maharashtra):\n');
    console.log(JSON.stringify(sample.rows, null, 2));
    
    // Get aggregated info
    const statsQuery = `
      SELECT 
        "Year",
        COUNT(DISTINCT "State_Name") as states_count,
        COUNT(DISTINCT "Constituency_Name") as constituencies_count,
        COUNT(DISTINCT "Party") as parties_count,
        COUNT(*) as total_records
      FROM election_loksabha_data
      GROUP BY "Year"
      ORDER BY "Year" DESC;
    `;
    const stats = await pool.query(statsQuery);
    
    console.log('\n\n📈 Data Statistics by Year:\n');
    console.log(stats.rows);
    
    // Get turnout info for Maharashtra 2014
    const turnoutQuery = `
      SELECT 
        "State_Name",
        "Year",
        AVG("Turnout_Percentage") as avg_turnout,
        COUNT(DISTINCT "Constituency_Name") as constituencies
      FROM election_loksabha_data
      WHERE "State_Name" = 'Maharashtra' AND "Year" = 2014
      GROUP BY "State_Name", "Year";
    `;
    const turnout = await pool.query(turnoutQuery);
    
    console.log('\n\n🗳️ Maharashtra 2014 Turnout:\n');
    console.log(turnout.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

getSampleData();
