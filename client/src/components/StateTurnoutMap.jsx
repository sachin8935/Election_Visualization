import { useEffect, useMemo, useState } from 'react';
import { getStateWiseTurnout } from '../services/api';
import { AlertCircle } from 'lucide-react';

const getColorForTurnout = (turnout, min, max) => {
  if (!turnout || max === min) return 'bg-slate-100';
  const normalized = (turnout - min) / (max - min);
  
  if (normalized >= 0.8) return 'bg-blue-600';
  if (normalized >= 0.6) return 'bg-green-500';
  if (normalized >= 0.4) return 'bg-yellow-400';
  if (normalized >= 0.2) return 'bg-orange-400';
  return 'bg-red-400';
};
const StateTurnoutMap = ({ filters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if no year is selected
  const hasNoYear = !filters.years || filters.years.length === 0;
  
  // Check if multiple years are selected
  const hasMultipleYears = filters.years && filters.years.length > 1;
  
  // Check if specific states are selected
  const hasStateFilter = filters.states && filters.states.length > 0;

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
      const loadData = async () => {
        try {
          setLoading(true);
          const response = await getStateWiseTurnout(queryParams);
          const sortedData = (Array.isArray(response.data?.data) ? response.data.data : [])
            .map(item => ({
              ...item,
              avg_turnout: Number(item.avg_turnout) || 0,
              total_votes: Number(item.total_votes) || 0,
              total_electors: Number(item.total_electors) || 0
            }))
            .sort((a, b) => b.avg_turnout - a.avg_turnout);
          setData(sortedData);
          setError(null);
        } catch (err) {
          console.error('Error loading turnout data:', err);
          setError('Failed to load turnout data');
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [queryParams, hasNoYear, hasMultipleYears]);

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
              Please select a <span className="font-semibold text-orange-600">year</span> from the Year filter above to view state-wise voter turnout data.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-gray-700">
              <p className="font-medium">Steps:</p>
              <ol className="text-left mt-2 space-y-1 ml-4 list-decimal">
                <li>Select one year from the filter</li>
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
              Voter turnout percentages vary significantly by year based on different election dynamics and elector counts. 
              Please select a <span className="font-semibold text-blue-600">single year</span> to view accurate state-wise comparisons.
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
        <p className="font-medium">No turnout data available for the selected filters.</p>
      </div>
    );
  }

  const minTurnout = data.length ? Math.min(...data.map(d => d.avg_turnout)) : 0;
  const maxTurnout = data.length ? Math.max(...data.map(d => d.avg_turnout)) : 0;
  
  const selectedYear = filters.years[0]; // Single year at this point

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span>Turnout %</span>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-400 rounded"></span>
            <span className="text-xs">Low</span>
            <div className="h-3 w-20 rounded-full bg-gradient-to-r from-red-400 via-green-500 to-blue-600" />
            <span className="text-xs">High</span>
            <span className="w-4 h-4 bg-blue-600 rounded"></span>
          </div>
          <span className="font-medium">
            {minTurnout.toFixed(1)}% - {maxTurnout.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Color-coded Grid/Table View */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">State-wise Voter Turnout - {selectedYear}</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.map((state) => {
            const colorClass = getColorForTurnout(state.avg_turnout, minTurnout, maxTurnout);
            
            return (
              <div
                key={state.State_Name}
                className={`${colorClass} rounded-lg p-4 text-white shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:scale-105`}
                title={`${state.State_Name}: ${state.avg_turnout.toFixed(2)}%`}
              >
                <div className="font-semibold text-sm mb-1 truncate">{state.State_Name}</div>
                <div className="text-2xl font-bold">{state.avg_turnout.toFixed(1)}%</div>
                <div className="text-xs opacity-90 mt-1">
                  {(state.total_votes / 1_000_000).toFixed(2)}M votes
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 10 States */}
      <div className="mt-6 rounded-lg border border-gray-200 p-4 bg-white shadow-sm">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">Top 10 States by Turnout</h4>
        <div className="space-y-2">
          {data.slice(0, 10).map((item, idx) => (
            <div key={item.State_Name} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-gray-700 font-medium">{item.State_Name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
                      style={{ width: `${(item.avg_turnout / maxTurnout) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-orange-600 font-semibold w-16 text-right">{item.avg_turnout.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {hasStateFilter 
            ? `Showing ${data.length} selected ${data.length === 1 ? 'state' : 'states'}` 
            : `Showing all ${data.length} states`}
        </p>
        <p className="text-lg font-bold text-gray-800 mt-1">Year: {selectedYear}</p>
      </div>
    </div>
  );
};

export default StateTurnoutMap;
