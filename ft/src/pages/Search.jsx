import React, { useState } from 'react';
import { Search as SearchIcon, Users, Briefcase } from 'lucide-react';
import { useSearch } from '../hooks/phase2-hooks';
import SearchBar from '../components/search/SearchBar';
import SearchFilters from '../components/search/SearchFilters';
import ProjectSearchResults from '../components/search/ProjectSearchResults';
import UserSearchResults from '../components/search/UserSearchResults';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const navigate = useNavigate();
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

  const handleProjectClick = (project) => {
    // Navigate to project detail page
    navigate(`/projects/${project.id}`);
  };

  const handleUserClick = (user) => {
    // Navigate to user profile page
    navigate(`/profile/${user.user_id || user.id}`);
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

        {/* Results - Using new dedicated components */}
        {searchType === 'projects' ? (
          <ProjectSearchResults
            projects={results}
            loading={isLoading}
            onProjectClick={handleProjectClick}
          />
        ) : (
          <UserSearchResults
            users={results}
            loading={isLoading}
            onUserClick={handleUserClick}
          />
        )}
      </div>
    </div>
  );
};

export default Search;