import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//import { Link } from "react-router-dom";

  

export default function SingleCountry(){
    const [country, setCountry] = useState([]);
    const {name} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getSingleCountry = async () => {
            try{
                const res = await fetch(`https://restcountries.com/v3.1/name/${name}`)
                const data = await res.json();
                if (data.status === 404) {
                    setError("Country not found");
                    setCountry([]);
                }else{
                    setCountry(data);
                    setError(null);
                }
            
            }catch(error){
                console.log(error);
                setError("Failed to fetch country data");
            }finally {
                setLoading(false);
              }
        };
getSingleCountry();
    },[name]);

    const [isImageLoaded, setImageLoaded] = useState(false);
    const [isInfoVisible, setInfoVisible] = useState(false);
  
    useEffect(() => {
      
      if (!loading && country.length > 0) {
        setTimeout(() => setImageLoaded(true), 300);
        setTimeout(() => setInfoVisible(true), 400);
      }
    }, [loading, country]);
  
  
    const InfoCategory = ({ label, value, icon }) => (
      <li className="flex items-center p-3 bg-white bg-opacity-70 rounded-lg shadow-sm mb-3 transform transition duration-300 hover:scale-105 hover:bg-opacity-100">
        <span className="text-blue-600 mr-3">{icon}</span>
        <div>
          <span className="font-semibold text-gray-700">{label}: </span>
          <span className="text-gray-800">{value || "N/A"}</span>
        </div>
      </li>
    );
  
    
    const BackButton = () => (
      <button
        onClick={() => console.log("Back to countries")}
        className="inline-flex items-center mb-8 px-6 py-3 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:bg-blue-500 hover:text-white transform hover:-translate-y-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Countries
      </button>
    );
  
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-gray-100">
          <div className="relative">
            <div className="w-20 h-20 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            <div className="mt-4 text-center text-blue-600 font-medium">Loading country information...</div>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex justify-center items-center h-screen bg-red-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <BackButton />
          </div>
        </div>
      );
    }
  
    if (!country || country.length === 0) {
        return (
          <div className="flex justify-center items-center h-screen bg-blue-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
              <div className="text-blue-500 text-5xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Country Not Found</h2>
              <p className="text-gray-600 mb-6">We couldn't find any information about "{name}".</p>
              <BackButton />
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BackButton />
    
            {country.map((item) => (
              <div
                key={item.population}
                className="bg-white bg-opacity-90 rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Flag Section */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-blue-50">
                    <div
                      className={`h-full flex items-center justify-center p-8 transform transition-all duration-1000 ${
                        isImageLoaded ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                      }`}
                    >
                      <img
                        src={item.flags.svg}
                        alt={item.name.common}
                        className="w-full max-w-md object-contain rounded-lg shadow-2xl"
                        style={{ maxHeight: "400px" }}
                        onLoad={() => setImageLoaded(true)}
                      />
                    </div>
                    
                    {item.coatOfArms?.svg && (
                      <div className="absolute top-4 right-4 w-20 h-20 opacity-70 hover:opacity-100 transition-opacity duration-300">
                        <img
                          src={item.coatOfArms.svg}
                          alt="Coat of Arms"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
    
                  {/* Information Section */}
                  <div
                    className={`p-8 transform transition-all duration-1000 ${
                      isInfoVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                    }`}
                  >
                    <div className="mb-6">
                      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                        {item.name.common}
                      </h1>
                      <p className="text-xl text-gray-500 italic">
                        {item.name.official}
                      </p>
                      
                      {item.capital && (
                        <div className="mt-3 flex items-center">
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium py-1 px-3 rounded-full">
                            Capital: {item.capital[0]}
                          </span>
                        </div>
                      )}
                    </div>
    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">
                          Basic Information
                        </h3>
                        <ul className="space-y-2">
                          <InfoCategory 
                            label="Population" 
                            value={item.population.toLocaleString()} 
                            icon="👥"
                          />
                          <InfoCategory 
                            label="Region" 
                            value={item.region} 
                            icon="🌍"
                          />
                          <InfoCategory 
                            label="Subregion" 
                            value={item.subregion} 
                            icon="📍"
                          />
                          <InfoCategory 
                            label="Area" 
                            value={`${item.area.toLocaleString()} km²`} 
                            icon="📐"
                          />
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">
                          Details
                        </h3>
                        <ul className="space-y-2">
                          <InfoCategory 
                            label="Currency" 
                            value={item.currencies
                              ? Object.values(item.currencies)
                                  .map((currency) => `${currency.name} (${currency.symbol})`)
                                  .join(", ")
                              : "N/A"} 
                            icon="💰"
                          />
                          <InfoCategory 
                            label="Languages" 
                            value={item.languages
                              ? Object.values(item.languages).join(", ")
                              : "N/A"} 
                            icon="🗣️"
                          />
                          <InfoCategory 
                            label="Driving Side" 
                            value={item.car?.side || "N/A"} 
                            icon="🚗"
                          />
                          <InfoCategory 
                            label="Independence" 
                            value={item.independent ? "Yes" : "No"} 
                            icon="🏛️"
                          />
                        </ul>
                      </div>
                    </div>
    
                    {/* Borders Section */}
                    {item.borders && item.borders.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">
                          Bordering Countries
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {item.borders.map((border, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium transform transition-all duration-300 hover:scale-110 hover:bg-blue-100"
                            >
                              {border}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
    
                    {/* Additional Details Section */}
                    <div className="mt-8">
                      <details className="bg-gray-50 rounded-lg px-4 py-2">
                        <summary className="font-medium text-gray-700 cursor-pointer focus:outline-none">
                          More Details
                        </summary>
                        <div className="mt-3 text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <p>Top Level Domain: {item.tld?.join(", ") || "N/A"}</p>
                          <p>Timezones: {item.timezones?.join(", ") || "N/A"}</p>
                          <p>
                            Gini Index:{" "}
                            {item.gini ? Object.values(item.gini).join(", ") : "N/A"}
                          </p>
                          <p>
                            Demonyms:{" "}
                            {item.demonyms?.eng
                              ? `${item.demonyms.eng.m} / ${item.demonyms.eng.f}`
                              : "N/A"}
                          </p>
                          <p>Continents: {item.continents?.join(", ") || "N/A"}</p>
                          <p>UN Member: {item.unMember ? "Yes" : "No"}</p>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

}