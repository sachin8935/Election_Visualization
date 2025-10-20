import pool from "./db.js";

export const getElectionData = async (req, res) => {
  try {
    const {
      year,
      yearStart,
      yearEnd,
      states,
      parties,
      genders,
      constituencies,
      limit = 5000,
      offset = 0,
    } = req.query;

    let query = `SELECT * FROM election_loksabha_data WHERE 1=1`;
    const values = [];
    let count = 1;

    if (year) {
      query += ` AND "Year" = $${count++}`;
      values.push(year);
    } else if (yearStart && yearEnd) {
      query += ` AND "Year" BETWEEN $${count++} AND $${count++}`;
      values.push(yearStart, yearEnd);
    }

    const arrayFilter = (field, list) => {
      const placeholders = list.map((_, i) => `$${count + i}`).join(",");
      query += ` AND "${field}" IN (${placeholders})`;
      values.push(...list);
      count += list.length;
    };

    if (states) arrayFilter("State_Name", states.split(","));
    if (parties) arrayFilter("Party", parties.split(","));
    if (genders) arrayFilter("Sex", genders.split(","));
    if (constituencies) {
      const constituencyList = constituencies.split(",").map(c => c.trim().toUpperCase());
      const placeholders = constituencyList.map((_, i) => `$${count + i}`).join(",");
      query += ` AND UPPER("Constituency_Name") IN (${placeholders})`;
      values.push(...constituencyList);
      count += constituencyList.length;
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await pool.query(countQuery, values);
    const totalRecords = parseInt(countResult.rows[0].count);

    query += ` ORDER BY "Year" DESC, "State_Name" ASC`;
    query += ` LIMIT $${count++} OFFSET $${count++}`;
    values.push(Math.min(parseInt(limit), 5000), parseInt(offset));

    const result = await pool.query(query, values);
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: totalRecords,
        limit: Math.min(parseInt(limit), 5000),
        offset: parseInt(offset),
        returned: result.rowCount
      }
    });
  } catch (err) {
    console.error("Error fetching election data:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error",
      message: err.message 
    });
  }
};

export const getUniqueValues = async (req, res) => {
  try {
    const validFields = ["State_Name", "Year", "Sex", "Party", "Constituency_Name"];
    const { field } = req.params;

    if (!validFields.includes(field)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid field name",
        validFields 
      });
    }

    const query = `SELECT DISTINCT "${field}" FROM election_loksabha_data WHERE "${field}" IS NOT NULL ORDER BY "${field}" ASC;`;
    const result = await pool.query(query);

    res.json({
      success: true,
      field,
      values: result.rows.map((row) => row[field]),
      count: result.rowCount
    });
  } catch (err) {
    console.error("Error fetching unique values:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error",
      message: err.message 
    });
  }
};

export const getAllFilterOptions = async (req, res) => {
  try {
    const fields = ["State_Name", "Year", "Sex", "Party", "Constituency_Name"];
    const data = {};

    for (const field of fields) {
      const query = `SELECT DISTINCT "${field}" FROM election_loksabha_data WHERE "${field}" IS NOT NULL ORDER BY "${field}" ASC;`;
      const result = await pool.query(query);
      data[field] = result.rows.map((row) => row[field]);
    }

    res.json({
      success: true,
      filters: data
    });
  } catch (err) {
    console.error("Error fetching filter options:", err);
    res.status(500).json({ 
      success: false,
      error: "Server error",
      message: err.message 
    });
  }
};

export const listTables = async (req, res) => {
  try {
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    const result = await pool.query(query);
    res.json({
      tables: result.rows.map((row) => row.table_name),
      count: result.rowCount,
    });
  } catch (err) {
    console.error("Error listing tables:", err);
    res.status(500).json({ error: "Server error" });
  }
};
export const pingSite = async (req, res) => {
  try {
    return res.status(200).json({
      message: "true",
    });
  } catch (err) {
    return res.status(500).json({
      error: "server error",
    });
  }
};

export const healthCheck = async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    return res.status(200).json({
      status: 'ok',
      db: 'connected'
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      db: 'disconnected',
      error: err.message
    });
  }
};
