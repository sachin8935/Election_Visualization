import pool from "./db.js";
export const getPartyWiseSeatShare = async (req, res) => {
  try {
    const { year, years, yearStart, yearEnd, states, parties, genders, constituencies } = req.query;
    
    let query = `
      SELECT 
        "Year",
        "Party",
        COUNT(*) FILTER (WHERE "Is_Winner" = 1) as seats_won,
        COUNT(*) as total_contested,
        ROUND(AVG("Vote_Share_Percentage"::numeric), 2) as avg_vote_share
      FROM election_loksabha_data
      WHERE 1=1
    `;
    const values = [];
    let count = 1;

    if (year) {
      query += ` AND "Year" = $${count++}`;
      values.push(year);
    } else if (years) {
      const yearList = years.split(",");
      const placeholders = yearList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Year" IN (${placeholders})`;
      values.push(...yearList);
      count += yearList.length;
    } else if (yearStart && yearEnd) {
      query += ` AND "Year" BETWEEN $${count++} AND $${count++}`;
      values.push(yearStart, yearEnd);
    }

    if (states) {
      const stateList = states.split(",");
      const placeholders = stateList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "State_Name" IN (${placeholders})`;
      values.push(...stateList);
      count += stateList.length;
    }

    if (parties) {
      const partyList = parties.split(",");
      const placeholders = partyList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Party" IN (${placeholders})`;
      values.push(...partyList);
      count += partyList.length;
    }

    if (genders) {
      const genderList = genders.split(",");
      const placeholders = genderList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Sex" IN (${placeholders})`;
      values.push(...genderList);
      count += genderList.length;
    }

    if (constituencies) {
      const constituencyList = constituencies.split(",");
      const placeholders = constituencyList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Constituency_Name" IN (${placeholders})`;
      values.push(...constituencyList);
      count += constituencyList.length;
    }

    query += `
      GROUP BY "Year", "Party"
      ORDER BY "Year" DESC, seats_won DESC
    `;

    const result = await pool.query(query, values);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (err) {
    console.error("Error fetching party-wise seat share:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error",
      message: err.message 
    });
  }
};

// 🗺️ 2️⃣ State-wise Turnout Analysis (For Map/Choropleth)
export const getStateWiseTurnout = async (req, res) => {
  try {
    const { year, years, yearStart, yearEnd, states, parties, genders, constituencies } = req.query;
    
    let query = `
      SELECT 
        "State_Name",
        "Year",
        ROUND(AVG("Turnout_Percentage"::numeric), 2) as avg_turnout,
        SUM("Valid_Votes"::numeric) as total_votes,
        SUM("Electors"::numeric) as total_electors
      FROM election_loksabha_data
      WHERE "Turnout_Percentage" IS NOT NULL
    `;
    const values = [];
    let count = 1;

    if (year) {
      query += ` AND "Year" = $${count++}`;
      values.push(year);
    } else if (years) {
      const yearList = years.split(",");
      const placeholders = yearList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Year" IN (${placeholders})`;
      values.push(...yearList);
      count += yearList.length;
    } else if (yearStart && yearEnd) {
      query += ` AND "Year" BETWEEN $${count++} AND $${count++}`;
      values.push(yearStart, yearEnd);
    }

    if (states) {
      const stateList = states.split(",");
      const placeholders = stateList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "State_Name" IN (${placeholders})`;
      values.push(...stateList);
      count += stateList.length;
    }

    if (parties) {
      const partyList = parties.split(",");
      const placeholders = partyList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Party" IN (${placeholders})`;
      values.push(...partyList);
      count += partyList.length;
    }

    if (genders) {
      const genderList = genders.split(",");
      const placeholders = genderList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Sex" IN (${placeholders})`;
      values.push(...genderList);
      count += genderList.length;
    }

    if (constituencies) {
      const constituencyList = constituencies.split(",");
      const placeholders = constituencyList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Constituency_Name" IN (${placeholders})`;
      values.push(...constituencyList);
      count += constituencyList.length;
    }

    query += `
      GROUP BY "State_Name", "Year"
      ORDER BY "Year" DESC, avg_turnout DESC
    `;

    const result = await pool.query(query, values);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (err) {
    console.error("Error fetching state-wise turnout:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error",
      message: err.message 
    });
  }
};

// 👥 3️⃣ Gender Representation Over Time (For Line Chart)
export const getGenderRepresentation = async (req, res) => {
  try {
    const { years, states, parties, constituencies } = req.query;
    
    let query = `
      SELECT 
        "Year",
        "Sex",
        COUNT(*) FILTER (WHERE "Is_Winner" = 1) as winners,
        COUNT(*) as total_candidates,
        ROUND(
          COUNT(*) FILTER (WHERE "Is_Winner" = 1)::numeric * 100.0 / 
          NULLIF(COUNT(*), 0), 
          2
        ) as win_percentage
      FROM election_loksabha_data
      WHERE "Sex" IS NOT NULL
        AND "Sex" IN ('Male', 'Female', 'Unknown', 'O')
    `;
    const values = [];
    let count = 1;

    if (years) {
      const yearList = years.split(",");
      const placeholders = yearList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Year" IN (${placeholders})`;
      values.push(...yearList);
      count += yearList.length;
    }

    if (states) {
      const stateList = states.split(",");
      const placeholders = stateList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "State_Name" IN (${placeholders})`;
      values.push(...stateList);
      count += stateList.length;
    }

    if (parties) {
      const partyList = parties.split(",");
      const placeholders = partyList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Party" IN (${placeholders})`;
      values.push(...partyList);
      count += partyList.length;
    }

    if (constituencies) {
      const constituencyList = constituencies.split(",");
      const placeholders = constituencyList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Constituency_Name" IN (${placeholders})`;
      values.push(...constituencyList);
      count += constituencyList.length;
    }

    query += `
      GROUP BY "Year", "Sex"
      ORDER BY "Year" ASC, "Sex"
    `;

    const result = await pool.query(query, values);
    
    // Normalize the data types
    const formattedData = result.rows.map(row => ({
      ...row,
      Year: parseInt(row.Year),
      winners: parseInt(row.winners),
      total_candidates: parseInt(row.total_candidates),
      win_percentage: parseFloat(row.win_percentage) || 0
    }));
    
    res.json({
      success: true,
      data: formattedData,
      count: result.rowCount
    });
  } catch (err) {
    console.error("Error fetching gender representation:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error",
      message: err.message 
    });
  }
};

// 🍩 4️⃣ Top Parties by Vote Share (For Donut Chart)
export const getTopPartiesByVoteShare = async (req, res) => {
  try {
    const { year, years, states, parties, genders, constituencies, limit = 10 } = req.query;
    
    // First, get total votes across all parties for the given filters
    let totalVotesQuery = `
      SELECT SUM("Votes"::numeric) as grand_total_votes
      FROM election_loksabha_data
      WHERE "Votes" IS NOT NULL
    `;
    
    // Then get party-wise data
    let query = `
      SELECT 
        "Party",
        SUM("Votes"::numeric) as total_votes,
        COUNT(*) FILTER (WHERE "Is_Winner" = 1) as seats_won,
        COUNT(DISTINCT "Constituency_Name") as constituencies_contested
      FROM election_loksabha_data
      WHERE "Votes" IS NOT NULL
    `;
    
    const values = [];
    let count = 1;

    // Build WHERE clause for both queries
    let whereClause = '';
    
    if (year) {
      whereClause += ` AND "Year" = $${count++}`;
      values.push(year);
    } else if (years) {
      const yearList = years.split(",");
      const placeholders = yearList.map((_, i) => `$${count + i}`).join(",");
      whereClause += ` AND "Year" IN (${placeholders})`;
      values.push(...yearList);
      count += yearList.length;
    }

    if (states) {
      const stateList = states.split(",");
      const placeholders = stateList.map((_, i) => `$${count + i}`).join(",");
      whereClause += ` AND "State_Name" IN (${placeholders})`;
      values.push(...stateList);
      count += stateList.length;
    }

    if (parties) {
      const partyList = parties.split(",");
      const placeholders = partyList.map((_, i) => `$${count + i}`).join(",");
      whereClause += ` AND "Party" IN (${placeholders})`;
      values.push(...partyList);
      count += partyList.length;
    }

    if (genders) {
      const genderList = genders.split(",");
      const placeholders = genderList.map((_, i) => `$${count + i}`).join(",");
      whereClause += ` AND "Sex" IN (${placeholders})`;
      values.push(...genderList);
      count += genderList.length;
    }

    if (constituencies) {
      const constituencyList = constituencies.split(",");
      const placeholders = constituencyList.map((_, i) => `$${count + i}`).join(",");
      whereClause += ` AND "Constituency_Name" IN (${placeholders})`;
      values.push(...constituencyList);
      count += constituencyList.length;
    }

    // Apply WHERE clause to both queries
    totalVotesQuery += whereClause;
    query += whereClause;

    query += `
      GROUP BY "Party"
      ORDER BY total_votes DESC
      LIMIT $${count++}
    `;
    values.push(parseInt(limit));

    // Execute both queries
    const totalVotesResult = await pool.query(totalVotesQuery, values.slice(0, -1)); // Exclude limit from total query
    const result = await pool.query(query, values);
    
    const grandTotalVotes = parseFloat(totalVotesResult.rows[0]?.grand_total_votes) || 1;
    
    // Calculate actual vote share percentage
    const dataWithVoteShare = result.rows.map(row => ({
      ...row,
      total_votes: parseInt(row.total_votes),
      seats_won: parseInt(row.seats_won),
      constituencies_contested: parseInt(row.constituencies_contested),
      vote_share_percentage: parseFloat(((row.total_votes / grandTotalVotes) * 100).toFixed(2))
    }));
    
    res.json({
      success: true,
      data: dataWithVoteShare,
      count: result.rowCount,
      metadata: {
        grand_total_votes: grandTotalVotes
      }
    });
  } catch (err) {
    console.error("Error fetching top parties by vote share:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error",
      message: err.message 
    });
  }
};

// 📈 5️⃣ Margin of Victory Distribution (For Histogram)
export const getMarginDistribution = async (req, res) => {
  try {
    const { year, years, states, parties, genders, constituencies } = req.query;
    
    let query = `
      SELECT 
        "Margin",
        "Margin_Percentage",
        "Candidate",
        "Party",
        "Constituency_Name",
        "State_Name",
        "Year"
      FROM election_loksabha_data
      WHERE "Is_Winner" = 1 
        AND "Margin" IS NOT NULL
        AND "Margin" >= 0
    `;
    const values = [];
    let count = 1;

    if (year) {
      query += ` AND "Year" = $${count++}`;
      values.push(year);
    } else if (years) {
      const yearList = years.split(",");
      const placeholders = yearList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Year" IN (${placeholders})`;
      values.push(...yearList);
      count += yearList.length;
    }

    if (states) {
      const stateList = states.split(",");
      const placeholders = stateList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "State_Name" IN (${placeholders})`;
      values.push(...stateList);
      count += stateList.length;
    }

    if (parties) {
      const partyList = parties.split(",");
      const placeholders = partyList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Party" IN (${placeholders})`;
      values.push(...partyList);
      count += partyList.length;
    }

    if (genders) {
      const genderList = genders.split(",");
      const placeholders = genderList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Sex" IN (${placeholders})`;
      values.push(...genderList);
      count += genderList.length;
    }

    if (constituencies) {
      const constituencyList = constituencies.split(",");
      const placeholders = constituencyList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Constituency_Name" IN (${placeholders})`;
      values.push(...constituencyList);
      count += constituencyList.length;
    }

    query += `
      ORDER BY "Margin" DESC
    `;

    const result = await pool.query(query, values);
    
    // Type conversion
    const formattedData = result.rows.map(row => ({
      ...row,
      Margin: parseInt(row.Margin),
      Margin_Percentage: parseFloat(row.Margin_Percentage),
      Year: parseInt(row.Year)
    }));
    
    // Calculate distribution buckets for histogram
    const margins = formattedData.map(r => r.Margin);
    
    // Define buckets
    const buckets = [
      { range: '0-5K', label: 'Very Close (0-5,000)', min: 0, max: 5000, count: 0 },
      { range: '5K-25K', label: 'Close (5,001-25,000)', min: 5001, max: 25000, count: 0 },
      { range: '25K-50K', label: 'Comfortable (25,001-50,000)', min: 25001, max: 50000, count: 0 },
      { range: '50K-100K', label: 'Strong (50,001-100,000)', min: 50001, max: 100000, count: 0 },
      { range: '100K-200K', label: 'Very Strong (100,001-200,000)', min: 100001, max: 200000, count: 0 },
      { range: '200K+', label: 'Landslide (200,001+)', min: 200001, max: Infinity, count: 0 }
    ];

    // Count margins in each bucket
    margins.forEach(margin => {
      const bucket = buckets.find(b => margin >= b.min && margin <= b.max);
      if (bucket) bucket.count++;
    });

    // Calculate statistics
    const totalConstituencies = margins.length;
    const avgMargin = totalConstituencies > 0 
      ? Math.round(margins.reduce((sum, m) => sum + m, 0) / totalConstituencies) 
      : 0;
    const maxMargin = totalConstituencies > 0 ? Math.max(...margins) : 0;
    const minMargin = totalConstituencies > 0 ? Math.min(...margins) : 0;
    
    // Close races (margin < 5000)
    const closeRaces = margins.filter(m => m <= 5000).length;
    const closeRacePercentage = totalConstituencies > 0 
      ? ((closeRaces / totalConstituencies) * 100).toFixed(1) 
      : 0;

    // Landslides (margin > 100000)
    const landslides = margins.filter(m => m > 100000).length;
    const landslidePercentage = totalConstituencies > 0 
      ? ((landslides / totalConstituencies) * 100).toFixed(1) 
      : 0;

    res.json({
      success: true,
      data: formattedData,
      distribution: buckets,
      statistics: {
        total_constituencies: totalConstituencies,
        avg_margin: avgMargin,
        max_margin: maxMargin,
        min_margin: minMargin,
        close_races: closeRaces,
        close_race_percentage: parseFloat(closeRacePercentage),
        landslides: landslides,
        landslide_percentage: parseFloat(landslidePercentage)
      },
      count: result.rowCount
    });
  } catch (err) {
    console.error("Error fetching margin distribution:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error",
      message: err.message 
    });
  }
};

// 🔍 6️⃣ Search by Candidate or Constituency (For Table/Filtered Results)
export const searchCandidateOrConstituency = async (req, res) => {
  try {
    const { 
      query: searchQuery, 
      limit = 100,
      years,
      states,
      parties,
      genders,
      constituencies 
    } = req.query;
    
    if (!searchQuery || searchQuery.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: "Search query must be at least 2 characters"
      });
    }

    let query = `
      SELECT 
        "Candidate",
        "Party",
        "Constituency_Name",
        "State_Name",
        "Year",
        "Votes",
        "Vote_Share_Percentage",
        "Is_Winner",
        "Margin",
        "Sex",
        "Position"
      FROM election_loksabha_data
      WHERE 
        ("Candidate" ILIKE $1 OR "Constituency_Name" ILIKE $1)
    `;
    
    const values = [`%${searchQuery.trim()}%`];
    let count = 2;

    // Apply filters
    if (years) {
      const yearList = years.split(",");
      const placeholders = yearList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Year" IN (${placeholders})`;
      values.push(...yearList);
      count += yearList.length;
    }

    if (states) {
      const stateList = states.split(",");
      const placeholders = stateList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "State_Name" IN (${placeholders})`;
      values.push(...stateList);
      count += stateList.length;
    }

    if (parties) {
      const partyList = parties.split(",");
      const placeholders = partyList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Party" IN (${placeholders})`;
      values.push(...partyList);
      count += partyList.length;
    }

    if (genders) {
      const genderList = genders.split(",");
      const placeholders = genderList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Sex" IN (${placeholders})`;
      values.push(...genderList);
      count += genderList.length;
    }

    if (constituencies) {
      const constituencyList = constituencies.split(",");
      const placeholders = constituencyList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "Constituency_Name" IN (${placeholders})`;
      values.push(...constituencyList);
      count += constituencyList.length;
    }

    query += ` ORDER BY "Year" DESC, "Vote_Share_Percentage" DESC LIMIT $${count}`;
    values.push(parseInt(limit));
    
    const result = await pool.query(query, values);
    
    // Convert string values to proper types
    const formattedData = result.rows.map(row => ({
      ...row,
      Year: parseInt(row.Year),
      Votes: parseInt(row.Votes),
      Is_Winner: parseInt(row.Is_Winner),
      Position: parseInt(row.Position),
      Margin: row.Margin ? parseInt(row.Margin) : null
    }));
    
    res.json({
      success: true,
      searchQuery: searchQuery.trim(),
      data: formattedData,
      count: result.rowCount
    });
  } catch (err) {
    console.error("Error searching candidate/constituency:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error",
      message: err.message 
    });
  }
};
