import express from 'express';
import { getAllFilterOptions, getElectionData, getUniqueValues, listTables, pingSite, healthCheck } from './controller.js';
import { 
  getPartyWiseSeatShare, 
  getStateWiseTurnout, 
  getGenderRepresentation,
  getTopPartiesByVoteShare,
  getMarginDistribution,
  searchCandidateOrConstituency
} from './analytics.js';
import { geminiquery } from './gemini.js';

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check server and database connectivity status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy and database is connected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       500:
 *         description: Server or database connection error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/health", healthCheck);

/**
 * @swagger
 * /api/ping:
 *   get:
 *     summary: Simple ping endpoint
 *     description: Lightweight ping to check if server is responding
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is responding
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "true"
 */
router.get("/ping", pingSite);

/**
 * @swagger
 * /api/elections:
 *   get:
 *     summary: Get election data with filters
 *     description: Retrieve election records with flexible filtering by year, state, party, gender, constituency, and pagination
 *     tags: [Data]
 *     parameters:
 *       - $ref: '#/components/parameters/year'
 *       - $ref: '#/components/parameters/yearStart'
 *       - $ref: '#/components/parameters/yearEnd'
 *       - $ref: '#/components/parameters/states'
 *       - $ref: '#/components/parameters/parties'
 *       - $ref: '#/components/parameters/genders'
 *       - $ref: '#/components/parameters/constituencies'
 *       - $ref: '#/components/parameters/limit'
 *       - $ref: '#/components/parameters/offset'
 *     responses:
 *       200:
 *         description: Successfully retrieved election data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ElectionRecord'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 63100
 *                     limit:
 *                       type: integer
 *                       example: 100
 *                     offset:
 *                       type: integer
 *                       example: 0
 *                     returned:
 *                       type: integer
 *                       example: 100
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/elections", getElectionData);

/**
 * @swagger
 * /api/unique/{field}:
 *   get:
 *     summary: Get unique values for a field
 *     description: Retrieve distinct values for dropdown filters (State_Name, Year, Sex, Party, Constituency_Name)
 *     tags: [Filters]
 *     parameters:
 *       - in: path
 *         name: field
 *         required: true
 *         schema:
 *           type: string
 *           enum: [State_Name, Year, Sex, Party, Constituency_Name]
 *         description: Field name to get unique values for
 *         example: State_Name
 *     responses:
 *       200:
 *         description: Successfully retrieved unique values
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 field:
 *                   type: string
 *                   example: "State_Name"
 *                 values:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Uttar Pradesh", "Maharashtra", "West Bengal"]
 *                 count:
 *                   type: integer
 *                   example: 35
 *       400:
 *         description: Invalid field name
 *       500:
 *         description: Server error
 */
router.get("/unique/:field", getUniqueValues);

/**
 * @swagger
 * /api/filters/all:
 *   get:
 *     summary: Get all filter options in one call
 *     description: Retrieve all unique values for all filterable fields (optimized for UI initialization)
 *     tags: [Filters]
 *     responses:
 *       200:
 *         description: Successfully retrieved all filter options
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 filters:
 *                   type: object
 *                   properties:
 *                     State_Name:
 *                       type: array
 *                       items:
 *                         type: string
 *                     Year:
 *                       type: array
 *                       items:
 *                         type: integer
 *                     Sex:
 *                       type: array
 *                       items:
 *                         type: string
 *                     Party:
 *                       type: array
 *                       items:
 *                         type: string
 *                     Constituency_Name:
 *                       type: array
 *                       items:
 *                         type: string
 *       500:
 *         description: Server error
 */
router.get("/filters/all", getAllFilterOptions);

/**
 * @swagger
 * /api/analytics/party-seats:
 *   get:
 *     summary: Party-wise seat share analysis
 *     description: Get seats won, total contested, and average vote share for each party (for Bar/Stacked charts)
 *     tags: [Analytics]
 *     parameters:
 *       - $ref: '#/components/parameters/year'
 *       - $ref: '#/components/parameters/years'
 *       - $ref: '#/components/parameters/yearStart'
 *       - $ref: '#/components/parameters/yearEnd'
 *       - $ref: '#/components/parameters/states'
 *       - $ref: '#/components/parameters/parties'
 *       - $ref: '#/components/parameters/genders'
 *       - $ref: '#/components/parameters/constituencies'
 *     responses:
 *       200:
 *         description: Party-wise seat share data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PartySeatShare'
 *                 count:
 *                   type: integer
 *                   example: 150
 *       500:
 *         description: Server error
 */
router.get("/analytics/party-seats", getPartyWiseSeatShare);

/**
 * @swagger
 * /api/analytics/state-turnout:
 *   get:
 *     summary: State-wise voter turnout analysis
 *     description: Get average turnout percentage, total votes, and electors by state (for Map/Choropleth visualization)
 *     tags: [Analytics]
 *     parameters:
 *       - $ref: '#/components/parameters/year'
 *       - $ref: '#/components/parameters/years'
 *       - $ref: '#/components/parameters/yearStart'
 *       - $ref: '#/components/parameters/yearEnd'
 *       - $ref: '#/components/parameters/states'
 *       - $ref: '#/components/parameters/parties'
 *       - $ref: '#/components/parameters/genders'
 *       - $ref: '#/components/parameters/constituencies'
 *     responses:
 *       200:
 *         description: State-wise turnout data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StateTurnout'
 *       500:
 *         description: Server error
 */
router.get("/analytics/state-turnout", getStateWiseTurnout);

/**
 * @swagger
 * /api/analytics/gender-representation:
 *   get:
 *     summary: Gender representation analysis
 *     description: Analyze candidate gender distribution, winners, and win rates over time (for Line chart)
 *     tags: [Analytics]
 *     parameters:
 *       - $ref: '#/components/parameters/year'
 *       - $ref: '#/components/parameters/years'
 *       - $ref: '#/components/parameters/yearStart'
 *       - $ref: '#/components/parameters/yearEnd'
 *       - $ref: '#/components/parameters/states'
 *       - $ref: '#/components/parameters/parties'
 *       - $ref: '#/components/parameters/constituencies'
 *     responses:
 *       200:
 *         description: Gender representation data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GenderRepresentation'
 *       500:
 *         description: Server error
 */
router.get("/analytics/gender-representation", getGenderRepresentation);

/**
 * @swagger
 * /api/analytics/top-parties:
 *   get:
 *     summary: Top parties by vote share
 *     description: Get top parties ranked by total votes and vote share percentage (for Donut chart)
 *     tags: [Analytics]
 *     parameters:
 *       - $ref: '#/components/parameters/year'
 *       - $ref: '#/components/parameters/years'
 *       - $ref: '#/components/parameters/yearStart'
 *       - $ref: '#/components/parameters/yearEnd'
 *       - $ref: '#/components/parameters/states'
 *       - $ref: '#/components/parameters/genders'
 *       - $ref: '#/components/parameters/constituencies'
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of top parties to return
 *         example: 10
 *     responses:
 *       200:
 *         description: Top parties data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TopParty'
 *       500:
 *         description: Server error
 */
router.get("/analytics/top-parties", getTopPartiesByVoteShare);

/**
 * @swagger
 * /api/analytics/margin-distribution:
 *   get:
 *     summary: Victory margin distribution analysis
 *     description: Analyze distribution of victory margins categorized by percentage ranges (for Histogram)
 *     tags: [Analytics]
 *     parameters:
 *       - $ref: '#/components/parameters/year'
 *       - $ref: '#/components/parameters/years'
 *       - $ref: '#/components/parameters/yearStart'
 *       - $ref: '#/components/parameters/yearEnd'
 *       - $ref: '#/components/parameters/states'
 *       - $ref: '#/components/parameters/parties'
 *       - $ref: '#/components/parameters/genders'
 *       - $ref: '#/components/parameters/constituencies'
 *     responses:
 *       200:
 *         description: Margin distribution data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MarginDistribution'
 *       500:
 *         description: Server error
 */
router.get("/analytics/margin-distribution", getMarginDistribution);

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search candidates or constituencies
 *     description: Search for candidates by name or constituencies by name (for Search Table)
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (candidate or constituency name)
 *         example: "Modi"
 *       - $ref: '#/components/parameters/year'
 *       - $ref: '#/components/parameters/limit'
 *       - $ref: '#/components/parameters/offset'
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SearchResult'
 *                 count:
 *                   type: integer
 *       400:
 *         description: Missing search query
 *       500:
 *         description: Server error
 */
router.get("/search", searchCandidateOrConstituency);

/**
 * @swagger
 * /api/ai/query:
 *   post:
 *     summary: AI-powered natural language query
 *     description: Ask questions about election data in natural language using Google Gemini AI
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 description: Natural language question about election data
 *                 example: "Who won the most seats in 2019?"
 *           examples:
 *             example1:
 *               summary: Simple query
 *               value:
 *                 query: "Who won the most seats in 2019?"
 *             example2:
 *               summary: Complex query
 *               value:
 *                 query: "What was the voter turnout in West Bengal compared to Uttar Pradesh in the 2019 elections?"
 *     responses:
 *       200:
 *         description: AI-generated response with data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 answer:
 *                   type: string
 *                   example: "BJP won the most seats in 2019 with 303 seats."
 *                 data:
 *                   type: object
 *                   description: Relevant data supporting the answer
 *       400:
 *         description: Missing query parameter
 *       500:
 *         description: AI service error
 */
router.post("/ai/query", geminiquery);

/**
 * @swagger
 * /api/debug/tables:
 *   get:
 *     summary: List all database tables
 *     description: Debug endpoint to list all tables in the database schema
 *     tags: [Debug]
 *     responses:
 *       200:
 *         description: List of database tables
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tables:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["election_loksabha_data"]
 *                 count:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Server error
 */
router.get("/debug/tables", listTables);

export default router;
