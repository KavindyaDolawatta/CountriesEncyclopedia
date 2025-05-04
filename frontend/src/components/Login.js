import { useState, useEffect } from "react";
import { User, LogIn, Globe, ChevronRight, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const serverurl = process.env.REACT_APP_SERVER_URL;
      const res = await fetch(`${serverurl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("user", username);
      localStorage.setItem("token", data.token);
      onLogin(username, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-gray-900 to-blue-900' : 'bg-gradient-to-r from-black to-sky-600'} text-white py-6`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Globe size={28} className="text-white animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Countries Encyclopedia
              </h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-40 transition-all"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className={`w-full max-w-md ${darkMode ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-lg'} rounded-xl overflow-hidden transition-all duration-300`}>
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} px-6 py-8 text-center relative`}>
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Globe size={200} />
            </div>
            <div className="relative z-10">
              <div className="inline-flex justify-center items-center w-20 h-20 rounded-full mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                <User size={32} />
              </div>
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Welcome</h2>
              <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Sign in to explore countries around the world
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            <div>
              <label className="block mb-2 font-medium">Username</label>
              <input
                type="text"
                className={`w-full px-4 py-3 rounded-lg outline-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Password</label>
              <input
                type="password"
                className={`w-full px-4 py-3 rounded-lg outline-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} border`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 ${
                darkMode ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
              } text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-all shadow ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'transform hover:translate-y-px active:translate-y-0'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                  <ChevronRight size={18} />
                </>
              )}
            </button>

            <p className="mt-4 text-sm text-center">
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")} className="text-blue-600 cursor-pointer hover:underline">
                Register
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-gradient-to-r from-black to-sky-600'} text-white py-4`}>
        <div className="container mx-auto text-center px-4">
          <p className="text-sm">Made with ❤️ by Kavindya Dolawatta</p>
        </div>
      </footer>
    </div>
  );
}
