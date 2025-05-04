import { useState, useEffect } from 'react';
import Article from './Article';
import { Search, Heart, X, ChevronDown, Loader2 } from 'lucide-react';

export default function Countries({ favorites = [], setFavorites }) {
    const [countries, setCountries] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
    const [selectedRegion, setSelectedRegion] = useState("");
    const [user, setUser] = useState(localStorage.getItem("user") || "guest");
    const [showFavorites, setShowFavorites] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
    const token = localStorage.getItem("token");
  
   
    useEffect(() => {
      localStorage.setItem(`${user}_favorites`, JSON.stringify(favorites));
    }, [favorites, user]);
  
    useEffect(() => {
      localStorage.setItem("darkMode", darkMode);
      document.body.classList.toggle("dark-mode", darkMode);
    }, [darkMode]);

    useEffect(() => {
      const getCountries = async () => {
        setIsLoading(true);
        try {
          const res = await fetch('https://restcountries.com/v3.1/all');
          if (!res.ok) throw new Error('Network response was not ok');
          const data = await res.json();
          setCountries(data.sort((a, b) => a.name.common.localeCompare(b.name.common)));
          setError(null);
        } catch (error) {
          setError('Failed to fetch countries. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      getCountries();
    }, []);
  
    async function searchCountry() {
      if (!search.trim()) {
        // Reset to all countries if search is empty
        const res = await fetch('https://restcountries.com/v3.1/all');
        const data = await res.json();
        setCountries(data.sort((a, b) => a.name.common.localeCompare(b.name.common)));
        return;
      }
      
      setIsLoading(true);
      try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${search}`);
        const data = await res.json();
        if (data.status === 404) {
          setError('No countries found matching your search');
          setCountries([]);
        } else {
          setCountries(data.sort((a, b) => a.name.common.localeCompare(b.name.common)));
          setError(null);
        }
      } catch (error) {
        setError('Error searching for countries');
      } finally {
        setIsLoading(false);
      }
    }
  
    async function filterByRegion(region) {
      if (!region) return;
      setIsLoading(true);
      try {
        const res = await fetch(`https://restcountries.com/v3.1/region/${region}`);
        const data = await res.json();
        setCountries(data.sort((a, b) => a.name.common.localeCompare(b.name.common)));
        setError(null);
      } catch (error) {
        setError('Error filtering countries by region');
      } finally {
        setIsLoading(false);
      }
    }
    function toggleFavorite(country) {
      const serverurl = process.env.REACT_APP_SERVER_URL;
      fetch(`${serverurl}/api/user/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ country }),
      })
        .then((res) => res.json())
        .then((data) => setFavorites(data))
        .catch((err) => console.error("Failed to toggle favorite:", err));
    }
    
    
    function resetFilters() {
      setSearch('');
      setSelectedRegion('');
      const getCountries = async () => {
        setIsLoading(true);
        try {
          const res = await fetch('https://restcountries.com/v3.1/all');
          const data = await res.json();
          setCountries(data.sort((a, b) => a.name.common.localeCompare(b.name.common)));
          setError(null);
        } catch (error) {
          setError('Failed to fetch countries');
        } finally {
          setIsLoading(false);
        }
      };
      getCountries();
    }
  
    const displayCountries = showFavorites ? favorites : countries;
  
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}>
        {/* Header */}
        <header className={`${darkMode ? 'bg-gradient-to-r from-blue-300 to-blue-900' : 'bg-gradient-to-r from-black to-sky-600'} text-white py-8 shadow-lg relative`}>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl md:text-5xl font-bold text-center flex items-center gap-3">
                <span className="inline-block animate-bounce">🌍</span> 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                  Countries Encyclopedia
                </span>
              </h1>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-40 transition-all"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition-all"
                  >
                    <span>{user}</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button
                        onClick={() => {
                          localStorage.removeItem("user");
                          setUser("guest");
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-center mt-3 text-lg font-medium text-white">
              Explore every corner of our planet
            </p>
          </div>
        </header>
  
        {/* Controls */}
        <main className="container mx-auto p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  showFavorites 
                    ? (darkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white') 
                    : (darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800')
                } hover:shadow-md`}
              >
                <Heart size={18} fill={showFavorites ? "white" : "none"} />
                {showFavorites ? "Showing Favorites" : "Show Favorites"}
              </button>
              
              {(search || selectedRegion) && (
                <button
                  onClick={resetFilters}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                  } hover:shadow-md transition-all`}
                >
                  <X size={18} />
                  Reset Filters
                </button>
              )}
            </div>
            
            <div className="text-sm">
              {!isLoading && (
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Showing {displayCountries.length} countries
                  {showFavorites ? ' (Favorites)' : ''}
                </span>
              )}
            </div>
          </div>
  
          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-10">
            <div className="flex-1 relative">
              <div className={`relative flex items-center rounded-lg overflow-hidden ${
                darkMode ? 'bg-gray-800 shadow-md' : 'bg-white shadow-md'
              }`}>
                <Search className="absolute left-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for a country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchCountry()}
                  className={`py-3 px-4 pl-10 w-full outline-none ${
                    darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
                  }`}
                />
                {search && (
                  <button 
                    onClick={() => {
                      setSearch('');
                      resetFilters();
                    }}
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="lg:w-64 relative">
              <div className={`relative rounded-lg overflow-hidden ${
                darkMode ? 'bg-gray-800 shadow-md' : 'bg-white shadow-md'
              }`}>
                <select
                  className={`py-3 px-4 w-full appearance-none outline-none ${
                    darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
                  }`}
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    filterByRegion(e.target.value);
                  }}
                >
                  <option value="" disabled>Filter by Region</option>
                  {regions.map((region, index) => (
                    <option key={index} value={region}>{region}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
          </div>
  
          {/* Loading & Error States */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader2 size={40} className="mx-auto animate-spin text-blue-600 mb-4" />
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Loading countries...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className={`text-center p-8 rounded-lg ${darkMode ? 'bg-red-900 text-white' : 'bg-red-50 text-red-600'} mb-6`}>
              <p className="text-lg font-medium">{error}</p>
              <button 
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100"
              >
                Try Again
              </button>
            </div>
          )}
  
          {/* No Results */}
          {!isLoading && !error && displayCountries.length === 0 && (
            <div className="text-center p-12">
              <img src="/api/placeholder/200/200" alt="No results" className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No Countries Found</h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                {showFavorites 
                  ? "You haven't added any favorites yet." 
                  : "Try adjusting your search or filters."}
              </p>
              {!showFavorites && (
                <button
                  onClick={resetFilters}
                  className={`mt-4 px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  } hover:opacity-90`}
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
  
          {/* Countries Grid */}
          {!isLoading && !error && displayCountries.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayCountries.map((country) => (
                <Article
                  key={country.name.common}
                  {...country}
                  isFavorite={favorites.some(f => f.name.common === country.name.common)}
                  toggleFavorite={() => toggleFavorite(country)}
                />
              ))}
            </div>
          )}
        </main>
  
        {/* Footer */}
        <footer className={`${darkMode ? 'bg-cyan-950 border-t border-gray-800' : 'bg-gradient-to-r from-black to-sky-500'} text-white py-6 mt-12`}>
          <div className="container mx-auto text-center px-4">
            <p className="text-lg">Made with ❤️ by Kavindya Dolawatta</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-200'} mt-2`}>
              Explore the world, one country at a time
            </p>
          </div>
        </footer>
      </div>
    );
}