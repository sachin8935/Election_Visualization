import { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getGenderRepresentation } from '../services/api';
import { AlertCircle } from 'lucide-react';

const GenderRepresentationChart = ({ filters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if no year is selected
  const hasNoYear = !filters.years || filters.years.length === 0;
  
  // Check which genders are selected in filter
  const selectedGenders = filters.genders || [];
  const showMale = selectedGenders.length === 0 || selectedGenders.includes('Male');
  const showFemale = selectedGenders.length === 0 || selectedGenders.includes('Female');
  const showUnknown = selectedGenders.includes('Unknown');
  const showOther = selectedGenders.includes('O');

  // Build query params from filters
  const queryParams = useMemo(() => {
    const params = {};
    if (filters.years?.length > 0) params.years = filters.years.join(',');
    if (filters.states?.length > 0) params.states = filters.states.join(',');
    if (filters.parties?.length > 0) params.parties = filters.parties.join(',');
    if (filters.constituencies?.length > 0) params.constituencies = filters.constituencies.join(',');
    // Don't pass gender filter to API - we want all genders to show comparison
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
      const response = await getGenderRepresentation(queryParams);
      const rawData = Array.isArray(response.data?.data) ? response.data.data : [];

      console.log('Gender API Response:', rawData); // Debug log

      // Transform data for line chart
      const years = [...new Set(rawData.map(d => d.Year))].sort();
      const chartData = years.map(year => {
        // Database has 'Male' and 'Female', not 'M' and 'F'
        const maleData = rawData.find(d => d.Year === year && d.Sex === 'Male');
        const femaleData = rawData.find(d => d.Year === year && d.Sex === 'Female');
        const unknownData = rawData.find(d => d.Year === year && d.Sex === 'Unknown');
        const otherData = rawData.find(d => d.Year === year && d.Sex === 'O');
        
        return {
          year,
          maleWinners: Number(maleData?.winners) || 0,
          femaleWinners: Number(femaleData?.winners) || 0,
          unknownWinners: Number(unknownData?.winners) || 0,
          otherWinners: Number(otherData?.winners) || 0,
          malePercentage: Number(maleData?.win_percentage) || 0,
          femalePercentage: Number(femaleData?.win_percentage) || 0,
          maleCandidates: Number(maleData?.total_candidates) || 0,
          femaleCandidates: Number(femaleData?.total_candidates) || 0,
          unknownCandidates: Number(unknownData?.total_candidates) || 0,
          otherCandidates: Number(otherData?.total_candidates) || 0,
        };
      });
      
      setData(chartData);
      setError(null);
    } catch (err) {
      console.error('Error fetching gender data:', err);
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
              Please select <span className="font-semibold text-orange-600">one or more years</span> from the Year filter above to view gender representation trends.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-gray-700">
              <p className="font-medium">Steps:</p>
              <ol className="text-left mt-2 space-y-1 ml-4 list-decimal">
                <li>Select one or more years from the filter</li>
                <li>Optionally select specific genders to compare</li>
                <li>Click "Apply Filters"</li>
                <li>View the gender representation trends</li>
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
        <p className="font-medium">No gender representation data available for the chosen filters.</p>
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis label={{ value: 'Winners', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Legend />
          {showMale && (
            <Line 
              type="monotone" 
              dataKey="maleWinners" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Male Winners"
              dot={{ r: 5 }}
            />
          )}
          {showFemale && (
            <Line 
              type="monotone" 
              dataKey="femaleWinners" 
              stroke="#ec4899" 
              strokeWidth={2}
              name="Female Winners"
              dot={{ r: 5 }}
            />
          )}
          {showUnknown && (
            <Line 
              type="monotone" 
              dataKey="unknownWinners" 
              stroke="#6b7280" 
              strokeWidth={2}
              name="Unknown Gender Winners"
              dot={{ r: 5 }}
              strokeDasharray="5 5"
            />
          )}
          {showOther && (
            <Line 
              type="monotone" 
              dataKey="otherWinners" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Other Gender Winners"
              dot={{ r: 5 }}
              strokeDasharray="5 5"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((yearData) => {
          const totalCandidates = yearData.maleCandidates + yearData.femaleCandidates + yearData.unknownCandidates + yearData.otherCandidates;
          const totalWinners = yearData.maleWinners + yearData.femaleWinners + yearData.unknownWinners + yearData.otherWinners;
          
          return (
            <div key={yearData.year} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="font-bold text-lg text-gray-800 mb-2">{yearData.year}</div>
              
              {/* Winners Section */}
              <div className="space-y-1 mb-3">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Winners</div>
                {showMale && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Male:</span>
                    <span className="text-sm font-semibold text-blue-600">{yearData.maleWinners}</span>
                  </div>
                )}
                {showFemale && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Female:</span>
                    <span className="text-sm font-semibold text-pink-600">{yearData.femaleWinners}</span>
                  </div>
                )}
                {showUnknown && yearData.unknownWinners > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Unknown:</span>
                    <span className="text-xs font-medium text-gray-500">{yearData.unknownWinners}</span>
                  </div>
                )}
                {showOther && yearData.otherWinners > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Other:</span>
                    <span className="text-xs font-medium text-amber-500">{yearData.otherWinners}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 border-t">
                  <span className="text-xs font-semibold text-gray-700">Total:</span>
                  <span className="text-xs font-bold text-gray-800">{totalWinners}</span>
                </div>
              </div>

              {/* Candidates Section */}
              <div className="space-y-1 pt-2 border-t">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Candidates</div>
                {showMale && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Male:</span>
                    <span className="text-xs font-medium text-gray-700">{yearData.maleCandidates}</span>
                  </div>
                )}
                {showFemale && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Female:</span>
                    <span className="text-xs font-medium text-gray-700">{yearData.femaleCandidates}</span>
                  </div>
                )}
                {showUnknown && yearData.unknownCandidates > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Unknown:</span>
                    <span className="text-xs font-medium text-gray-500">{yearData.unknownCandidates}</span>
                  </div>
                )}
                {showOther && yearData.otherCandidates > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Other:</span>
                    <span className="text-xs font-medium text-gray-500">{yearData.otherCandidates}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 border-t">
                  <span className="text-xs font-semibold text-gray-700">Total:</span>
                  <span className="text-xs font-bold text-gray-800">{totalCandidates}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Showing gender representation across {data.length} election year{data.length !== 1 ? 's' : ''}
        </p>
        {selectedGenders.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Filtered genders: {selectedGenders.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};

export default GenderRepresentationChart;
