import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Analytics API calls
export const getPartyWiseSeatShare = (params = {}) => {
  return api.get('/analytics/party-seats', { params });
};

export const getStateWiseTurnout = (params = {}) => {
  return api.get('/analytics/state-turnout', { params });
};

export const getGenderRepresentation = (params = {}) => {
  return api.get('/analytics/gender-representation', { params });
};

export const getTopPartiesByVoteShare = (params = {}) => {
  return api.get('/analytics/top-parties', { params });
};

export const getMarginDistribution = (params = {}) => {
  return api.get('/analytics/margin-distribution', { params });
};

export const searchCandidateOrConstituency = (query, filters = {}, limit = 100) => {
  const params = { query, limit };
  
  // Add filter parameters if they exist
  if (filters.years?.length > 0) {
    params.years = filters.years.join(',');
  }
  if (filters.states?.length > 0) {
    params.states = filters.states.join(',');
  }
  if (filters.parties?.length > 0) {
    params.parties = filters.parties.join(',');
  }
  if (filters.genders?.length > 0) {
    params.genders = filters.genders.join(',');
  }
  if (filters.constituencies?.length > 0) {
    params.constituencies = filters.constituencies.join(',');
  }
  
  return api.get('/search', { params });
};

// Filter options
export const getAllFilterOptions = () => {
  return api.get('/filters/all');
};

export const getElectionData = (params = {}) => {
  return api.get('/elections', { params });
};

// AI Query
export const askAIQuestion = async (question) => {
  try {
    const response = await api.post('/ai/query', { query: question });
    return response.data;
  } catch (error) {
    console.error('AI Query Error:', error);
    if (error.response?.data) {
      const errorMsg = error.response.data.message 
        || error.response.data.error 
        || error.response.data.reason 
        || 'Failed to process query';
      throw new Error(errorMsg);
    }
    if (error.request) {
      throw new Error('No response from server. Please check if the server is running.');
    }
    throw new Error(error.message || 'Network error. Please check your connection.');
  }
};

export default api;
