import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ElectionDashboard from './Filter';
import PartySeatsChart from './PartySeatsChart';
import StateTurnoutMap from './StateTurnoutMap';
import GenderRepresentationChart from './GenderRepresentationChart';
import TopPartiesDonut from './TopPartiesDonut';
import MarginDistributionChart from './MarginDistributionChart';
import SearchTable from './SearchTable';
import { BarChart3, Map, TrendingUp, PieChart, BarChart2, Search as SearchIcon, Home } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [appliedFilters, setAppliedFilters] = useState({
    years: [],
    genders: [],
    states: [],
    parties: [],
    constituencies: []
  });

  const [selectedVisualizations, setSelectedVisualizations] = useState({
    partySeats: false,
    stateTurnout: false,
    genderRepresentation: false,
    topParties: false,
    marginDistribution: false,
    search: false
  });

  const visualizations = [
    { id: 'partySeats', name: 'Party-wise Seat Share', icon: <BarChart3 className="w-5 h-5" />, component: PartySeatsChart },
    { id: 'stateTurnout', name: 'State-wise Turnout', icon: <Map className="w-5 h-5" />, component: StateTurnoutMap },
    { id: 'genderRepresentation', name: 'Gender Representation', icon: <TrendingUp className="w-5 h-5" />, component: GenderRepresentationChart },
    { id: 'topParties', name: 'Top Parties by Vote Share', icon: <PieChart className="w-5 h-5" />, component: TopPartiesDonut },
    { id: 'marginDistribution', name: 'Margin Distribution', icon: <BarChart2 className="w-5 h-5" />, component: MarginDistributionChart },
    { id: 'search', name: 'Search Candidates/Constituencies', icon: <SearchIcon className="w-5 h-5" />, component: SearchTable }
  ];

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
  };

  const toggleVisualization = (id) => {
    setSelectedVisualizations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selectAllVisualizations = () => {
    const allSelected = {};
    visualizations.forEach(v => allSelected[v.id] = true);
    setSelectedVisualizations(allSelected);
  };

  const clearAllVisualizations = () => {
    const allCleared = {};
    visualizations.forEach(v => allCleared[v.id] = false);
    setSelectedVisualizations(allCleared);
  };

  const selectedCount = Object.values(selectedVisualizations).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">🗳️ Election Loksabha Data Analytics</h1>
              <p className="text-orange-100 mt-2 text-sm md:text-base">Comprehensive analysis of Indian Lok Sabha elections with advanced filtering</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border border-orange-200 whitespace-nowrap font-semibold"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Filters Section - Now uses your Filter component */}
      <div className="bg-white border-b border-gray-200">
        <ElectionDashboard onApplyFilters={handleApplyFilters} />
      </div>

      {/* Visualization Selector */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Select Visualizations to Display ({selectedCount} selected)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={selectAllVisualizations}
                className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={clearAllVisualizations}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {visualizations.map(viz => (
              <label
                key={viz.id}
                className={`flex items-start gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedVisualizations[viz.id]
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedVisualizations[viz.id]}
                  onChange={() => toggleVisualization(viz.id)}
                  className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 flex-shrink-0 mt-0.5"
                />
                <div className="flex flex-col gap-2 min-w-0">
                  <div className={selectedVisualizations[viz.id] ? 'text-orange-500' : 'text-gray-400'}>
                    {viz.icon}
                  </div>
                  <span className={`text-sm font-medium leading-tight break-words ${selectedVisualizations[viz.id] ? 'text-orange-700' : 'text-gray-600'}`}>
                    {viz.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Visualizations */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {selectedCount === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <BarChart3 className="w-20 h-20 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Visualizations Selected</h3>
            <p className="text-gray-500">Please select at least one visualization to display from the options above.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {visualizations.map(viz => {
              if (!selectedVisualizations[viz.id]) return null;
              
              const Component = viz.component;
              return (
                <div key={viz.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-orange-500">{viz.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-800">{viz.name}</h3>
                  </div>
                  <Component filters={appliedFilters} />
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-gray-400">
            Made By Sachin
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
