import { useState, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import eventService from '../../services/eventService';

const EventFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters 
}) => {
  const [categories, setCategories] = useState(['All']);
  const [locations, setLocations] = useState(['All']);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await eventService.getFilters();
        if (data && data.success) {
          if (data.categories && data.categories.length > 0) {
            setCategories(['All', ...data.categories]);
          }
          if (data.locations && data.locations.length > 0) {
            setLocations(['All', ...data.locations]);
          }
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

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
        <select
          value={filters.category || 'All'}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      /* Location Filter */
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Location</label>
        <select
          value={filters.location || 'All'}
          onChange={(e) => onFilterChange('location', e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc === 'All' ? 'All Locations' : loc}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EventFilters;