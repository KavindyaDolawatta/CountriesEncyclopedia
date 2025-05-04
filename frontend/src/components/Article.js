import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Article({ flags, name, population, region, subregion, capital, languages, isFavorite, toggleFavorite }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl relative">
      <Link to={`/${name.common}`}>
        <div className="h-48 overflow-hidden">
          <img src={flags.svg} alt={`${name.common} flag`} className="w-full h-full object-cover" />
        </div>
        <div className="p-6">
          <h2 className="font-bold text-xl text-gray-900 mb-3 truncate">{name.common}</h2>
          <ul className="space-y-1 text-gray-600">
            <li><span className="font-semibold mr-2">Population:</span>{population.toLocaleString()}</li>
            <li><span className="font-semibold mr-2">Region:</span>{region}</li>
            {subregion && <li><span className="font-semibold mr-2">Subregion:</span>{subregion}</li>}
            {capital && <li><span className="font-semibold mr-2">Capital:</span>{capital}</li>}
            {languages && <li><span className="font-semibold mr-2">Languages:</span>{Object.values(languages).join(", ")}</li>}
          </ul>
        </div>
      </Link>

      {/* Favorite Button */}
      <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-600 opacity-70 hover:opacity-100'
          }`}
        >
          <Heart size={20} fill={isFavorite ? "white" : "none"} />
        </button>
    </div>
  );
}
