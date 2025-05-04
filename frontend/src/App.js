import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Countries from "./components/Countries";
import SingleCountry from "./components/SingleCountry";
import Error from "./components/Error";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(`${user}_favorites`);
    if (saved) setFavorites(JSON.parse(saved));
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`${user}_favorites`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" replace /> : <Login onLogin={setUser} />
          }
        />
        <Route
          path="/register"
          element={
            user ? <Navigate to="/" replace /> : <Register onRegister={setUser} />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            user ? (
              <Countries
                user={user}
                setUser={setUser}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/:name" element={user ? <SingleCountry /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
