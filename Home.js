import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './App';
import MovieList from './components/MovieList';
import MovieCard from './components/MovieCard';
import axios from 'axios';

function Home() {
  const { user } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await axios.get(`https://www.omdbapi.com/?s=${searchTerm}&apikey=YOUR_OMDB_API_KEY`);
