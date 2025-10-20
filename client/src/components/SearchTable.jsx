import { useState } from 'react';
import { Search } from 'lucide-react';
import { searchCandidateOrConstituency } from '../services/api';

const SearchTable = ({ filters = {} }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (searchQuery.trim().length < 2) {
      setError('Please enter at least 2 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Pass filters to the backend API
      const response = await searchCandidateOrConstituency(searchQuery, filters);
      
      // Data is already filtered on the backend, no need for client-side filtering
      setData(response.data.data);
      setSearched(true);
    } catch (err) {
      console.error('Error searching:', err);
      setError('Failed to search');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate name or constituency..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {searched && data.length === 0 && !loading && (
        <div className="text-gray-500 text-center py-8">
          No results found for "{searchQuery}"
          {Object.values(filters).some(arr => arr.length > 0) && ' with the applied filters'}
        </div>
      )}

      {data.length > 0 && (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Found {data.length} results for "{searchQuery}"
            {Object.values(filters).some(arr => arr.length > 0) && ' (filtered)'}
          </div>
          
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Candidate</th>
                  <th className="px-4 py-3 text-left font-semibold">Party</th>
                  <th className="px-4 py-3 text-left font-semibold">Constituency</th>
                  <th className="px-4 py-3 text-left font-semibold">State</th>
                  <th className="px-4 py-3 text-left font-semibold">Year</th>
                  <th className="px-4 py-3 text-right font-semibold">Votes</th>
                  <th className="px-4 py-3 text-right font-semibold">Vote %</th>
                  <th className="px-4 py-3 text-center font-semibold">Position</th>
                  <th className="px-4 py-3 text-center font-semibold">Result</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{row.Candidate}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                        {row.Party}
                      </span>
                    </td>
                    <td className="px-4 py-3">{row.Constituency_Name}</td>
                    <td className="px-4 py-3">{row.State_Name}</td>
                    <td className="px-4 py-3">{row.Year}</td>
                    <td className="px-4 py-3 text-right">{row.Votes?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{row.Vote_Share_Percentage}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        row.Position === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {row.Position ? `#${row.Position}` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {(row.Is_Winner === 1 || row.Is_Winner === '1' || row.Position === 1) ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                          🏆 WON
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          Lost
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchTable;
