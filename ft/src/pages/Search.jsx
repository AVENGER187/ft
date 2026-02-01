import React, { useState } from 'react';
import { Search as SearchIcon, Users, Briefcase } from 'lucide-react';
import { useSearch } from '../hooks/phase2-hooks';
import SearchBar from '../components/search/SearchBar';
import SearchFilters from '../components/search/SearchFilters';
import ProjectCard from '../components/projects/ProjectCard';
import { searchService } from '../services/search.service';

const Search = () => {
  const [searchType, setSearchType] = useState('projects');
  const { results, isLoading, filters, suggestions, search, getSuggestions, updateFilters } = 
    useSearch(searchType);

  const handleSearch = async (query) => {
    await search(query);
  };

  const handleGetSuggestions = async (query) => {
    await getSuggestions(query);
    return suggestions;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Advanced Search</h1>
          <p className="text-gray-600">Find projects and filmmakers that match your criteria</p>
        </div>

        {/* Search Type Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setSearchType('projects')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              searchType === 'projects'
                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            Projects
          </button>
          <button
            onClick={() => setSearchType('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              searchType === 'users'
                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            People
          </button>
        </div>

        {/* Search Bar & Filters */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1">
            <SearchBar
              onSearch={handleSearch}
              onSuggestionsRequest={handleGetSuggestions}
              placeholder={`Search ${searchType}...`}
            />
          </div>
          <SearchFilters
            filters={filters}
            onFiltersChange={updateFilters}
            type={searchType}
          />
        </div>

        {/* Results */}
        <div>
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div>
              <p className="text-gray-600 mb-6">
                Found {results.length} {searchType}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchType === 'projects' ? (
                  results.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  results.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <SearchIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No results found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// User Card Component
const UserCard = ({ user }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">
            {user.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.location}</p>
        </div>
      </div>
      {user.bio && <p className="text-gray-600 mb-4 line-clamp-2">{user.bio}</p>}
      {user.skills && (
        <div className="flex flex-wrap gap-2">
          {user.skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;