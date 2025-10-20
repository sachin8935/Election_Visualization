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

// Existing routes
router.get("/debug/tables", listTables);           // 🔍 debug route
router.get("/elections", getElectionData);         // main filtered data
router.get("/unique/:field", getUniqueValues);     // unique values by field
router.get("/filters/all", getAllFilterOptions);   // all dropdowns in one call

// Analytics routes for visualizations
router.get("/analytics/party-seats", getPartyWiseSeatShare);           // Bar/Stacked Chart
router.get("/analytics/state-turnout", getStateWiseTurnout);           // Map/Choropleth
router.get("/analytics/gender-representation", getGenderRepresentation); // Line Chart
router.get("/analytics/top-parties", getTopPartiesByVoteShare);        // Donut Chart
router.get("/analytics/margin-distribution", getMarginDistribution);   // Histogram
router.get("/search", searchCandidateOrConstituency);                 // Search Table
router.get("/ping", pingSite);
router.get("/health", healthCheck);

// AI Query route
router.post("/ai/query", geminiquery);                                // AI-powered natural language queries

export default router;
