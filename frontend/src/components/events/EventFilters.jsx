import { FiFilter } from 'react-icons/fi';
import { CATEGORIES, LOCATIONS } from '../../utils/constants';

const EventFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters 
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 flex items-center">
          <FiFilter className="mr-2" /> Filters
        </h3>
        <button 
          onClick={onClearFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
        <div className="space-y-2">
          <button
            onClick={() => onFilterChange('category', 'All')}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              filters.category === 'All'
                ? 'bg-primary-50 text-primary-700 font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => onFilterChange('category', cat)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.category === cat
                  ? 'bg-primary-50 text-primary-700 font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Location</label>
        <div className="space-y-2">
          <button
            onClick={() => onFilterChange('location', 'All')}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              filters.location === 'All'
                ? 'bg-primary-50 text-primary-700 font-bold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Locations
          </button>
          {LOCATIONS.map(loc => (
            <button
              key={loc}
              onClick={() => onFilterChange('location', loc)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.location === loc
                  ? 'bg-primary-50 text-primary-700 font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
