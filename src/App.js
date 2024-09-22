import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PokemonCard from './component/PokemonCard';
import './App.css';

const App = () => {
    const [pokemons, setPokemons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20');
                const results = response.data.results;

                // Fetch additional details for each Pokémon (e.g., image)
                const pokemonDetails = await Promise.all(
                    results.map(async (pokemon) => {
                        const pokemonData = await axios.get(pokemon.url);
                        return pokemonData.data;
                    })
                );

                setPokemons(pokemonDetails);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchPokemons();
    }, []);

    const filteredPokemons = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>Loading...</p>;

    return (
        <div className="app">
            <h1>Pokémon List</h1>
            <input
                type="text"
                placeholder="Search Pokémon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="pokemon-container">
            {searchTerm && filteredPokemons.length === 0 ? (
          <div
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>No Pokémon found with that name</h3>
          </div>
        ) : (
          filteredPokemons.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))
        )}
            </div>
        </div>
    );
};

export default App;
