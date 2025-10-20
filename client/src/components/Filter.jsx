import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ChevronDown, Filter, RefreshCw } from 'lucide-react';

// Import JSON files directly
import yearsData from '../Year.json';
import gendersData from '../gender.json';
import statesData from '../state.json';
import top50PartiesData from '../top_50_parties.json';
import allPartiesData from '../parties.json';
import constituenciesData from '../constituencies.json';

const FilterDropdown = ({
  title,
  filterType,
  items,
  icon,
  activeDropdown,
  setActiveDropdown,
  filters,
  toggleFilter,
  selectAll,
  clearFilter
}) => {
  const isOpen = activeDropdown === filterType;
  const selectedCount = filters[filterType].length;
  const isDisabled = items.length === 0;

  return (
    <div className="relative">
      <button
        onClick={() => !isDisabled && setActiveDropdown(isOpen ? null : filterType)}
        disabled={isDisabled}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
          isDisabled
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            : selectedCount > 0
            ? 'bg-orange-50 border-orange-300 text-orange-700'
            : 'bg-white border-gray-200 hover:border-orange-300 text-gray-700'
        }`}
      >
        {icon}
        <span className="font-medium">{title}</span>
        {selectedCount > 0 && (
          <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
            {selectedCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
          <div className="absolute top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-hidden flex flex-col">
            <div className="p-3 border-b border-gray-200 flex gap-2">
              <button
                onClick={() => selectAll(filterType, items)}
                className="flex-1 px-3 py-1.5 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={() => clearFilter(filterType)}
                className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {items.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">No items available</div>
              ) : (
                <div className="p-2">
                  {items.map(item => (
                    <label
                      key={item}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters[filterType].includes(item)}
                        onChange={() => toggleFilter(filterType, item)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ---------------------------------------------------------
   PARTY FILTER DROPDOWN (with search)
--------------------------------------------------------- */
const PartyFilterDropdown = ({
  isOpen,
  setActiveDropdown,
  filters,
  toggleFilter,
  selectAll,
  clearFilter,
  top50Parties,
  allParties,
  partySearchMode,
  setPartySearchMode,
  partySearchTerm,
  setPartySearchTerm
}) => {
  const partySearchRef = useRef(null);

  const filteredParties = useMemo(() => {
    const list = partySearchMode ? allParties : top50Parties;
    if (!partySearchTerm) return list;
    const term = partySearchTerm.toLowerCase();
    return list.filter(p => p.toLowerCase().includes(term));
  }, [partySearchTerm, partySearchMode, allParties, top50Parties]);

  const selectedCount = filters.parties.length;

  return (
    <div className="relative">
      <button
        onClick={() => setActiveDropdown(isOpen ? null : 'parties')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
          selectedCount > 0
            ? 'bg-orange-50 border-orange-300 text-orange-700'
            : 'bg-white border-gray-200 hover:border-orange-300 text-gray-700'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span className="font-medium">Parties</span>
        {selectedCount > 0 && (
          <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
            {selectedCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={e => {
              if (!partySearchRef.current?.contains(e.target)) {
                setActiveDropdown(null);
              }
            }}
          />
          <div className="absolute top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-hidden flex flex-col">
            <div className="p-3 border-b border-gray-200 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => selectAll('parties', partySearchMode ? allParties : top50Parties)}
                  className="flex-1 px-3 py-1.5 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={() => clearFilter('parties')}
                  className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="relative" ref={partySearchRef}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search parties..."
                  value={partySearchTerm}
                  onChange={e => {
                    setPartySearchTerm(e.target.value);
                    if (e.target.value && !partySearchMode) setPartySearchMode(true);
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  autoComplete="off"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={partySearchMode}
                  onChange={e => {
                    setPartySearchMode(e.target.checked);
                    if (!e.target.checked) setPartySearchTerm('');
                  }}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                Search from all parties
              </label>
            </div>

            <div className="overflow-y-auto flex-1">
              <div className="p-2">
                {filteredParties.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">No parties found</div>
                ) : (
                  filteredParties.map(p => (
                    <label
                      key={p}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.parties.includes(p)}
                        onChange={() => toggleFilter('parties', p)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{p}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ---------------------------------------------------------
   CONSTITUENCY FILTER DROPDOWN (dependent on state)
--------------------------------------------------------- */
const ConstituencyFilterDropdown = ({
  isOpen,
  setActiveDropdown,
  filters,
  toggleFilter,
  selectAll,
  clearFilter,
  availableConstituencies,
  filteredConstituencies,
  constituencySearchTerm,
  setConstituencySearchTerm
}) => {
  const constituencySearchRef = useRef(null);
  const selectedCount = filters.constituencies.length;
  const isDisabled = filters.states.length === 0;

  return (
    <div className="relative">
      <button
        onClick={() => !isDisabled && setActiveDropdown(isOpen ? null : 'constituencies')}
        disabled={isDisabled}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
          isDisabled
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            : selectedCount > 0
            ? 'bg-orange-50 border-orange-300 text-orange-700'
            : 'bg-white border-gray-200 hover:border-orange-300 text-gray-700'
        }`}
      >
        <div className="w-4 h-4 text-orange-500">🗳️</div>
        <span className="font-medium">Constituencies</span>
        {selectedCount > 0 && (
          <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
            {selectedCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={e => {
              if (!constituencySearchRef.current?.contains(e.target)) {
                setActiveDropdown(null);
              }
            }}
          />
          <div className="absolute top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-hidden flex flex-col">
            <div className="p-3 border-b border-gray-200 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => selectAll('constituencies', availableConstituencies)}
                  className="flex-1 px-3 py-1.5 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={() => clearFilter('constituencies')}
                  className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="relative" ref={constituencySearchRef}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search constituencies..."
                  value={constituencySearchTerm}
                  onChange={e => setConstituencySearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {filteredConstituencies.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  {availableConstituencies.length === 0
                    ? 'Please select a state first'
                    : 'No constituencies found'}
                </div>
              ) : (
                <div className="p-2">
                  {filteredConstituencies.map(c => (
                    <label
                      key={c}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.constituencies.includes(c)}
                        onChange={() => toggleFilter('constituencies', c)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{c}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ---------------------------------------------------------
   MAIN DASHBOARD COMPONENT
--------------------------------------------------------- */
export default function ElectionDashboard({ onApplyFilters }) {
  const [years] = useState(Array.isArray(yearsData) ? yearsData : []);
  const [genders] = useState(Array.isArray(gendersData) ? gendersData : []);
  const [states] = useState(Array.isArray(statesData) ? statesData : []);
  const [top50Parties] = useState(Array.isArray(top50PartiesData) ? top50PartiesData : []);
  const [allParties] = useState(Array.isArray(allPartiesData) ? allPartiesData : []);
  const [constituencies] = useState(constituenciesData || {});

  const [filters, setFilters] = useState({
    years: [],
    genders: [],
    states: [],
    parties: [],
    constituencies: []
  });

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [partySearchMode, setPartySearchMode] = useState(false);
  const [partySearchTerm, setPartySearchTerm] = useState('');
  const [constituencySearchTerm, setConstituencySearchTerm] = useState('');

  const availableConstituencies = useMemo(() => {
    if (filters.states.length === 0) return [];
    const set = new Set();
    filters.states.forEach(s => {
      (constituencies[s] || []).forEach(c => set.add(c));
    });
    return Array.from(set).sort();
  }, [filters.states, constituencies]);

  useEffect(() => {
    if (filters.states.length > 0) {
      setFilters(prev => ({
        ...prev,
        constituencies: prev.constituencies.filter(c => availableConstituencies.includes(c))
      }));
    } else {
      setFilters(prev => ({ ...prev, constituencies: [] }));
    }
  }, [filters.states, availableConstituencies]);

  const filteredConstituencies = useMemo(() => {
    if (!constituencySearchTerm) return availableConstituencies;
    const term = constituencySearchTerm.toLowerCase();
    return availableConstituencies.filter(c => c.toLowerCase().includes(term));
  }, [constituencySearchTerm, availableConstituencies]);

  const toggleFilter = (type, val) => {
    setFilters(prev => {
      const selected = prev[type];
      return {
        ...prev,
        [type]: selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]
      };
    });
  };

  const selectAll = (type, items) => setFilters(prev => ({ ...prev, [type]: items }));
  const clearFilter = type => setFilters(prev => ({ ...prev, [type]: [] }));
  const clearAllFilters = () =>
    setFilters({ years: [], genders: [], states: [], parties: [], constituencies: [] });

  const activeFiltersCount = Object.values(filters).reduce((acc, arr) => acc + arr.length, 0);

  const handleAnalyze = () => {
    // Pass filters to parent Dashboard component
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between mb-4 items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <Filter className="w-5 h-5 text-orange-500" /> Filters
            </h2>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-orange-600 hover:bg-orange-50 rounded transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <FilterDropdown
              title="Year"
              filterType="years"
              items={years}
              icon={<Filter className="w-4 h-4 text-orange-500" />}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              filters={filters}
              toggleFilter={toggleFilter}
              selectAll={selectAll}
              clearFilter={clearFilter}
            />
            <FilterDropdown
              title="Gender"
              filterType="genders"
              items={genders}
              icon={<Filter className="w-4 h-4 text-pink-500" />}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              filters={filters}
              toggleFilter={toggleFilter}
              selectAll={selectAll}
              clearFilter={clearFilter}
            />
            <FilterDropdown
              title="State"
              filterType="states"
              items={states}
              icon={<Filter className="w-4 h-4 text-blue-500" />}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              filters={filters}
              toggleFilter={toggleFilter}
              selectAll={selectAll}
              clearFilter={clearFilter}
            />
            <PartyFilterDropdown
              isOpen={activeDropdown === 'parties'}
              setActiveDropdown={setActiveDropdown}
              filters={filters}
              toggleFilter={toggleFilter}
              selectAll={selectAll}
              clearFilter={clearFilter}
              top50Parties={top50Parties}
              allParties={allParties}
              partySearchMode={partySearchMode}
              setPartySearchMode={setPartySearchMode}
              partySearchTerm={partySearchTerm}
              setPartySearchTerm={setPartySearchTerm}
            />
            <ConstituencyFilterDropdown
              isOpen={activeDropdown === 'constituencies'}
              setActiveDropdown={setActiveDropdown}
              filters={filters}
              toggleFilter={toggleFilter}
              selectAll={selectAll}
              clearFilter={clearFilter}
              availableConstituencies={availableConstituencies}
              filteredConstituencies={filteredConstituencies}
              constituencySearchTerm={constituencySearchTerm}
              setConstituencySearchTerm={setConstituencySearchTerm}
            />
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {Object.entries(filters).map(([type, arr]) =>
                arr.map(v => (
                  <span
                    key={`${type}-${v}`}
                    className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                  >
                    {v}
                    <button
                      onClick={() => toggleFilter(type, v)}
                      className="hover:text-orange-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={handleAnalyze}
              className="px-6 py-2.5 rounded-lg font-medium transition-all bg-orange-600 text-white hover:bg-orange-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
