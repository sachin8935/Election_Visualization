import { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPartyWiseSeatShare } from '../services/api';
import { AlertCircle } from 'lucide-react';

const PartySeatsChart = ({ filters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if no year is selected
  const hasNoYear = !filters.years || filters.years.length === 0;
  
  // Check if multiple years are selected
  const hasMultipleYears = filters.years && filters.years.length > 1;
  
  // Check if specific parties are selected
  const hasPartyFilter = filters.parties && filters.parties.length > 0;

  // Build query params from filters - use filter years if available
  const queryParams = useMemo(() => {
    const params = {};
    if (filters.years?.length > 0) params.years = filters.years.join(',');
    if (filters.states?.length > 0) params.states = filters.states.join(',');
    if (filters.parties?.length > 0) params.parties = filters.parties.join(',');
    if (filters.genders?.length > 0) params.genders = filters.genders.join(',');
    if (filters.constituencies?.length > 0) params.constituencies = filters.constituencies.join(',');
    return params;
  }, [filters]);

  useEffect(() => {
    if (!hasNoYear && !hasMultipleYears) {
      fetchData();
    }
  }, [queryParams, hasNoYear, hasMultipleYears]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getPartyWiseSeatShare(queryParams);
      const rawData = Array.isArray(response.data?.data) ? response.data.data : [];

      // Normalise numeric fields
      const normalizedData = rawData
        .map(item => ({
          ...item,
          seats_won: Number(item.seats_won) || 0,
          total_contested: Number(item.total_contested) || 0,
          avg_vote_share: Number(item.avg_vote_share) || 0
        }))
        .sort((a, b) => b.seats_won - a.seats_won);

      // If parties are filtered, show only those parties
      // Otherwise, show top 10
      const finalData = hasPartyFilter 
        ? normalizedData 
        : normalizedData.slice(0, 10);

      setData(finalData);
      setError(null);
    } catch (err) {
      console.error('Error fetching party seats data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Show message if no year is selected
  if (hasNoYear) {
    return (
      <div className="relative h-96">
        {/* Blurred background */}
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <div className="w-full h-full bg-white/50 backdrop-blur-md rounded-lg"></div>
        </div>
        
        {/* Message overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center border-2 border-orange-200">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Year Selection Required</h3>
            <p className="text-gray-600 mb-4">
              Please select a <span className="font-semibold text-orange-600">year</span> from the Year filter above to view party-wise seat share data.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-gray-700">
              <p className="font-medium">Steps:</p>
              <ol className="text-left mt-2 space-y-1 ml-4 list-decimal">
                <li>Select any one year from the filter</li>
                <li>Click "Apply Filters"</li>
                <li>View the visualization</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show message if multiple years are selected
  if (hasMultipleYears) {
    return (
      <div className="relative h-96">
        {/* Blurred background */}
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <div className="w-full h-full bg-white/50 backdrop-blur-md rounded-lg"></div>
        </div>
        
        {/* Message overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center border-2 border-blue-200">
            <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Single Year Required</h3>
            <p className="text-gray-600 mb-4">
              You have selected <span className="font-semibold text-blue-600">{filters.years.length} years</span> ({filters.years.join(', ')}). 
            </p>
            <p className="text-gray-600 mb-4">
              Party-wise seat share varies by year as different parties contest different numbers of seats. 
              Please select a <span className="font-semibold text-blue-600">single year</span> to view accurate results.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
              <p className="font-medium">To fix:</p>
              <p className="mt-2">Select only <strong>one year</strong> from the Year filter and click "Apply Filters"</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="flex items-center justify-center h-96">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (data.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-gray-500">
        <p className="font-medium">No party seat data available for the chosen filters.</p>
      </div>
    );
  }

  const selectedYear = filters.years[0]; // Single year at this point

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Party" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="seats_won" fill="#ea580c" name="Seats Won" />
          <Bar dataKey="total_contested" fill="#94a3b8" name="Total Contested" />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {hasPartyFilter 
            ? `Showing ${data.length} selected ${data.length === 1 ? 'party' : 'parties'}` 
            : `Showing top ${data.length} parties by seats won`}
        </p>
        <p className="text-lg font-bold text-gray-800 mt-1">Year: {selectedYear}</p>
      </div>
    </div>
  );
};

export default PartySeatsChart;
