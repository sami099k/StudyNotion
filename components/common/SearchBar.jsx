import React, { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

const SearchBar = ({ onSearch, onFilter, placeholder = "Search courses..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#999DAA]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-12 py-3 bg-[#161D29] border border-[#2C333F] rounded-lg text-[#F1F2F3] placeholder-[#999DAA] focus:outline-none focus:ring-2 focus:ring-[#FFD60A] focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999DAA] hover:text-[#F1F2F3] transition-colors duration-200"
          >
            <FaFilter />
          </button>
        </div>
      </form>

      {/* Filter Options */}
      {showFilters && (
        <div className="mt-4 p-4 bg-[#161D29] border border-[#2C333F] rounded-lg">
          <h3 className="text-lg font-semibold text-[#F1F2F3] mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-[#F1F2F3] mb-2">Price Range</label>
              <select 
                onChange={(e) => onFilter({ type: 'price', value: e.target.value })}
                className="w-full bg-[#2C333F] border border-[#424855] rounded-md px-3 py-2 text-[#F1F2F3] focus:outline-none focus:ring-2 focus:ring-[#FFD60A]"
              >
                <option value="">All Prices</option>
                <option value="free">Free</option>
                <option value="0-1000">₹0 - ₹1,000</option>
                <option value="1000-5000">₹1,000 - ₹5,000</option>
                <option value="5000+">₹5,000+</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-[#F1F2F3] mb-2">Rating</label>
              <select 
                onChange={(e) => onFilter({ type: 'rating', value: e.target.value })}
                className="w-full bg-[#2C333F] border border-[#424855] rounded-md px-3 py-2 text-[#F1F2F3] focus:outline-none focus:ring-2 focus:ring-[#FFD60A]"
              >
                <option value="">All Ratings</option>
                <option value="4.5+">4.5+ Stars</option>
                <option value="4.0+">4.0+ Stars</option>
                <option value="3.5+">3.5+ Stars</option>
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-[#F1F2F3] mb-2">Level</label>
              <select 
                onChange={(e) => onFilter({ type: 'level', value: e.target.value })}
                className="w-full bg-[#2C333F] border border-[#424855] rounded-md px-3 py-2 text-[#F1F2F3] focus:outline-none focus:ring-2 focus:ring-[#FFD60A]"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 