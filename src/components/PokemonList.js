import { observer } from "mobx-react-lite";
import { useState } from 'react';
import pokemonStore from "../stores/PokemonStore";
import PokemonCard from "./PokemonCard";
import Pagination from "../components/Pagination";

// const PokemonList = observer(() => {
//     useEffect(() => {
//         pokemonStore.loadPokemons();
//     }, []);
//
//     if (pokemonStore.error) return <div>Ошибка: {pokemonStore.error}</div>;
//     if (pokemonStore.pokemons.length === 0) return <div>Покемоны не найдены.</div>;
//
//     return (
//         <div>
//             <div>
//                 <button onClick={() => pokemonStore.prevPage()} disabled={pokemonStore.offset === 0}>Prev</button>
//                 <button onClick={() => pokemonStore.nextPage()}>Next</button>
//                 <button onClick={() => {pokemonStore.setLimit(10);pokemonStore.loadPokemons()}}>10</button>
//                 <button onClick={() => {pokemonStore.setLimit(20);pokemonStore.loadPokemons()}}>20</button>
//                 <button onClick={() => {pokemonStore.setLimit(50);pokemonStore.loadPokemons()}}>50</button>
//                 <Pagination
//                     currentPage={pokemonStore.offset / pokemonStore.limit + 1}
//                     totalPages={Math.ceil(pokemonStore.pokemonCount / pokemonStore.limit)}
//                     onPageChange={(page) => {
//                         pokemonStore.offset = (page - 1) * pokemonStore.limit;
//                         pokemonStore.loadPokemons();
//                     }}
//                 />
//             </div>
//             <div style={{
//                 display: "grid",
//                 gap: "20px",
//                 justifyContent: "center", // Центрирование сетки
//                 gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Сделаем адаптивным
//             }}>
//                 {pokemonStore.pokemons.map((pokemon) => (
//                     <PokemonCard key={pokemon.name} {...pokemon} />
//                 ))}
//             </div>
//         </div>
//     );
// });

const PokemonList = observer(() => {
    const [inputValue, setInputValue] = useState("");

    const handleSearch = () => {
        pokemonStore.setSearchQuery(inputValue);
        pokemonStore.applySearch();
    };

    return (
        <div>
            <h1>Pokedex</h1>

            {/* Пагинация */}
            <div style={{ margin: "20px 0" }}>
                <button
                    onClick={() => pokemonStore.prevPage()}
                    disabled={pokemonStore.offset === 0}
                >
                    Назад
                </button>

                <span style={{ margin: "0 20px" }}>
                    Страница {Math.floor(pokemonStore.offset / pokemonStore.limit) + 1}
                </span>

                <button
                    onClick={() => pokemonStore.nextPage()}
                    disabled={pokemonStore.offset + pokemonStore.limit >= pokemonStore.pokemonCount}
                >
                    Вперед
                </button>
            </div>

            {/* Поисковая панель */}
            <div style={{ margin: "20px 0" }}>
                <input
                    type="text"
                    placeholder="Поиск по имени..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch}>Поиск</button>
            </div>

            {/* Список покемонов */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px" }}>
                {pokemonStore.pokemons.map(pokemon => (
                    <div key={pokemon.name} className="pokemon-card">
                        <img src={pokemon.image} alt={pokemon.name} style={{ width: "100%" }} />
                        <h3>{pokemon.name}</h3>
                        <div>
                            {pokemon.types.map(type => (
                                <span
                                    key={type}
                                    style={{
                                        backgroundColor: "#4CAF50",
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        margin: "4px",
                                        color: "white"
                                    }}
                                >
                                    {type}
                                </span>
                            ))}
                        </div>
                        <div>
                            <p>HP: {pokemon.stats.hp}</p>
                            <p>Defense: {pokemon.stats.defense}</p>
                            <p>Speed: {pokemon.stats.speed}</p>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
});

export default PokemonList;