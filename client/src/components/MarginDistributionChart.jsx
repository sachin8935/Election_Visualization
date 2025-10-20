import { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getMarginDistribution } from '../services/api';
import { AlertCircle } from 'lucide-react';

// Color gradient from close races (red) to landslides (green)
const COLORS = ['#ef4444', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981'];

const MarginDistributionChart = ({ filters = {} }) => {
  const [data, setData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if no year is selected
  const hasNoYear = !filters.years || filters.years.length === 0;

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
    if (!hasNoYear) {
      fetchData();
    }
  }, [queryParams, hasNoYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getMarginDistribution(queryParams);
      
      console.log('Margin Distribution Response:', response.data); // Debug log
      
      // Use the distribution array from backend
      const chartData = response.data.distribution || [];
      
      setData(chartData);
      setStatistics(response.data.statistics || null);
      setError(null);
    } catch (err) {
      console.error('Error fetching margin data:', err);
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
              Please select <span className="font-semibold text-orange-600">one or more years</span> from the Year filter above to view margin of victory distribution.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-gray-700">
              <p className="font-medium mb-2">What is Margin of Victory?</p>
              <p className="text-xs text-left">
                <strong>Margin of Victory (MoV)</strong> = Votes of Winner - Votes of Runner-up
              </p>
              <p className="text-xs text-left mt-2">
                This shows how competitive elections were. Close races (&lt;5K margin) indicate tight contests, while landslides (&gt;100K) show dominant wins.
              </p>
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
        <p className="font-medium">No margin data available for the chosen filters.</p>
      </div>
    );
  }

  const displayYears = filters.years?.length > 0 
    ? filters.years.join(', ') 
    : 'all years';

  return (
    <div>
      {/* Explanation Banner */}
      <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
        <h3 className="text-sm font-bold text-purple-900 mb-2">📊 Margin of Victory Distribution</h3>
        <p className="text-xs text-gray-700 mb-2">
          <strong>Margin of Victory</strong> = Winner's Votes - Runner-up's Votes (per constituency)
        </p>
        <p className="text-xs text-gray-600">
          This chart shows how constituencies are distributed by victory margin. 
          Close races indicate competitive elections, while landslides show dominant wins.
        </p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white border rounded-lg p-3 shadow-sm">
            <div className="text-xs text-gray-600">Total Constituencies</div>
            <div className="text-2xl font-bold text-gray-800">{statistics.total_constituencies}</div>
          </div>
          <div className="bg-white border rounded-lg p-3 shadow-sm">
            <div className="text-xs text-gray-600">Avg Margin</div>
            <div className="text-2xl font-bold text-blue-600">{(statistics.avg_margin / 1000).toFixed(1)}K</div>
            <div className="text-xs text-gray-500">{statistics.avg_margin.toLocaleString()} votes</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-sm">
            <div className="text-xs text-red-700 font-semibold">Close Races (&lt;5K)</div>
            <div className="text-2xl font-bold text-red-600">{statistics.close_races}</div>
            <div className="text-xs text-red-600">{statistics.close_race_percentage}% of total</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-sm">
            <div className="text-xs text-green-700 font-semibold">Landslides (&gt;100K)</div>
            <div className="text-2xl font-bold text-green-600">{statistics.landslides}</div>
            <div className="text-xs text-green-600">{statistics.landslide_percentage}% of total</div>
          </div>
        </div>
      )}

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="range" 
            angle={-45} 
            textAnchor="end" 
            height={100}
            label={{ value: 'Victory Margin Range (votes)', position: 'insideBottom', offset: -20 }}
          />
          <YAxis label={{ value: 'Number of Constituencies', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                    <p className="font-bold text-gray-800">{data.label}</p>
                    <p className="text-sm text-gray-600">{data.range} votes</p>
                    <p className="text-lg font-semibold text-purple-600">{data.count} constituencies</p>
                    {statistics && (
                      <p className="text-xs text-gray-500">
                        {((data.count / statistics.total_constituencies) * 100).toFixed(1)}% of total
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend with descriptions */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        {data.map((bucket, index) => (
          <div key={bucket.range} className="flex items-center gap-2 p-2 bg-white rounded border">
            <div 
              className="w-4 h-4 rounded flex-shrink-0" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-800 truncate">{bucket.label}</div>
              <div className="text-xs text-gray-600">{bucket.count} seats</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Showing margin distribution for {displayYears}
        </p>
        {filters.states?.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Filtered by: {filters.states.join(', ')}
          </p>
        )}
        {statistics && (
          <p className="text-xs text-gray-500 mt-1">
            Range: {(statistics.min_margin / 1000).toFixed(1)}K - {(statistics.max_margin / 1000).toFixed(1)}K votes
          </p>
        )}
      </div>
    </div>
  );
};

export default MarginDistributionChart;
