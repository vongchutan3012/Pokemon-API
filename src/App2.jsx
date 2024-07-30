import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App2() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=10')
      .then(response => {
        const pokemonList = response.data.results;
        const pokemonPromises = pokemonList.map(pokemon =>
          axios.get(pokemon.url).then(res => res.data)
        );

        Promise.all(pokemonPromises)
          .then(pokemonData => {
            setPokemons(pokemonData);
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('Error fetching the Pokémon data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold">Pokémon List</h1>
      <div className="flex overflow-x-auto mt-4 space-x-4">
        {pokemons.map(pokemon => (
          <div key={pokemon.id} className="flex-none text-center p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold">{pokemon.name}</h2>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} className="mt-2" />
            <p className="mt-2">Height: {pokemon.height}</p>
            <p className="mt-2">Weight: {pokemon.weight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App2;
