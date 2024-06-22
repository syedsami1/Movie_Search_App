import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MovieDetails from './pages/MovieDetails';
import axios from 'axios';

// Create a context for user authentication state
export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  // Fetch user from local storage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Functions for login, signup, and logout
  const handleLogin = async (userData) => {
    const response = await axios.post('/api/login', userData);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  const handleSignup = async (userData) => {
    await axios.post('/api/signup', userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, handleLogin, handleSignup, handleLogout }}>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/movie/:imdbID" element={<MovieDetails />} />
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
