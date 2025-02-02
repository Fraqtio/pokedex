import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import pokemonStore from "../stores/PokemonStore";
import PokemonCard from "./PokemonCard";
import Pagination from "../components/Pagination";

const PokemonList = observer(() => {
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        pokemonStore.loadPokemons();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
        pokemonStore.setSearchQuery(event.target.value.toLowerCase());
        pokemonStore.applySearch();
    };


    if (pokemonStore.error) return <div>Ошибка: {pokemonStore.error}</div>;
    if (pokemonStore.pokemons.length === 0) return <div>Покемоны не найдены.</div>;

    return (
        <div>
            {/* Поле для поиска */}
            <input
                type="text"
                placeholder="Поиск покемона..."
                value={searchTerm}
                onChange={handleSearch}
                style={{
                    padding: "8px",
                    marginBottom: "10px",
                    width: "100%",
                    maxWidth: "300px",
                    display: "block",
                }}
            />
            <div>
                <button onClick={() => pokemonStore.prevPage()} disabled={pokemonStore.offset === 0}>Prev</button>
                <button onClick={() => pokemonStore.nextPage()}>Next</button>
                <button onClick={() => {pokemonStore.setLimit(10);pokemonStore.loadPokemons()}}>10</button>
                <button onClick={() => {pokemonStore.setLimit(20);pokemonStore.loadPokemons()}}>20</button>
                <button onClick={() => {pokemonStore.setLimit(50);pokemonStore.loadPokemons()}}>50</button>
                <Pagination
                    currentPage={pokemonStore.offset / pokemonStore.limit + 1}
                    totalPages={Math.ceil(pokemonStore.pokemonCount / pokemonStore.limit)}
                    onPageChange={(page) => {
                        pokemonStore.offset = (page - 1) * pokemonStore.limit;
                        pokemonStore.loadPokemons();
                    }}
                />
            </div>
            <div style={{
                display: "grid",
                gap: "20px",
                justifyContent: "center", // Центрирование сетки
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Сделаем адаптивным
            }}>
                {pokemonStore.pokemons.map((pokemon) => (
                    <PokemonCard key={pokemon.name} {...pokemon} />
                ))}
            </div>
        </div>
    );
});


export default PokemonList;