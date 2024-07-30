import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App2() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchPokemons = (offset) => {
    axios.get(`https://pokeapi.co/api/v2/pokemon?limit=15&offset=${offset}`)
      .then(response => {
        const pokemonList = response.data.results;
        const pokemonPromises = pokemonList.map(pokemon =>
          axios.get(pokemon.url).then(res => res.data)
        );

        Promise.all(pokemonPromises)
          .then(pokemonData => {
            setPokemons(prevPokemons => [...prevPokemons, ...pokemonData]);
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('Error fetching the Pokémon data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPokemons(offset);
  }, [offset]);

  const loadMore = () => {
    setOffset(prevOffset => prevOffset + 15);
    setLoading(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold">Pokémon List</h1>
      {loading && offset === 0 ? (
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      ) : (
        <>
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
          <button
            onClick={loadMore}
            className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </>
      )}
    </div>
  );
}

export default App2;
