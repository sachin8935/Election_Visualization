import { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getTopPartiesByVoteShare } from '../services/api';
import { AlertCircle } from 'lucide-react';

const COLORS = ['#ea580c', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];

const TopPartiesDonut = ({ filters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if no year is selected
  const hasNoYear = !filters.years || filters.years.length === 0;

  // Build query params from filters - use filter years if available
  const queryParams = useMemo(() => {
    const params = { limit: 10 };
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
      const response = await getTopPartiesByVoteShare(queryParams);
      const rawData = Array.isArray(response.data?.data) ? response.data.data : [];

      console.log('Top Parties API Response:', response.data); // Debug log

      const normalised = rawData.map(item => ({
        ...item,
        vote_share_percentage: Number(item.vote_share_percentage) || 0,
        total_votes: Number(item.total_votes) || 0,
        seats_won: Number(item.seats_won) || 0,
        constituencies_contested: Number(item.constituencies_contested) || 0
      }));

      setData(normalised);
      setError(null);
    } catch (err) {
      console.error('Error fetching top parties data:', err);
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
              Please select <span className="font-semibold text-orange-600">one or more years</span> from the Year filter above to view top parties by vote share.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-gray-700">
              <p className="font-medium">Steps:</p>
              <ol className="text-left mt-2 space-y-1 ml-4 list-decimal">
                <li>Select one or more years from the filter</li>
                <li>Click "Apply Filters"</li>
                <li>View the vote share distribution</li>
              </ol>
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
        <p className="font-medium">No vote share data available for the chosen filters.</p>
      </div>
    );
  }

  const displayYears = filters.years?.length > 0 
    ? filters.years.join(', ') 
    : 'all years';

  // Calculate total percentage shown
  const totalPercentage = data.reduce((sum, party) => sum + party.vote_share_percentage, 0).toFixed(2);
  const totalVotes = data.reduce((sum, party) => sum + party.total_votes, 0);
  const totalSeats = data.reduce((sum, party) => sum + party.seats_won, 0);

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={140}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="vote_share_percentage"
            label={({ Party, vote_share_percentage }) => `${Party}: ${vote_share_percentage}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name, props) => [
              <div key="tooltip">
                <div>Vote Share: {value}%</div>
                <div>Seats Won: {props.payload.seats_won}</div>
                <div>Total Votes: {props.payload.total_votes.toLocaleString()}</div>
              </div>,
              props.payload.Party
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        {data.map((party, index) => (
          <div key={party.Party} className="flex items-center gap-2 p-2 bg-white rounded border">
            <div 
              className="w-4 h-4 rounded flex-shrink-0" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 truncate">{party.Party}</div>
              <div className="text-xs text-gray-600">
                {party.vote_share_percentage}% • {party.seats_won} seats
              </div>
              <div className="text-xs text-gray-500">
                {(party.total_votes / 1000000).toFixed(2)}M votes
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm font-semibold text-blue-900 mb-2">Summary for {displayYears}</div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs text-gray-600">Top {data.length} Parties</div>
            <div className="font-bold text-blue-700">{totalPercentage}%</div>
            <div className="text-xs text-gray-500">of total votes</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Total Votes</div>
            <div className="font-bold text-blue-700">{(totalVotes / 1000000).toFixed(2)}M</div>
            <div className="text-xs text-gray-500">by top parties</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Seats Won</div>
            <div className="font-bold text-blue-700">{totalSeats}</div>
            <div className="text-xs text-gray-500">by top parties</div>
          </div>
        </div>
        {filters.states?.length > 0 && (
          <div className="mt-2 text-xs text-gray-600">
            Filtered by: {filters.states.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPartiesDonut;
