import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import pokemonStore from "../stores/PokemonStore";
import PokemonCard from "./PokemonCard";
import Pagination from "../components/Pagination";
import { debounce } from 'lodash';
import {allTypes, typeColors} from "../constants/pokeTypes";

const PokemonList = observer(() => {
    const [searchTerm, setSearchTerm] = useState("");
    const currentPage = Math.floor(pokemonStore.offset / pokemonStore.limit) + 1;
    const totalPages = Math.max(1, Math.ceil(pokemonStore.pokemonCount / pokemonStore.limit));

    const handlePageChange = (page) => {
        const newOffset = (page - 1) * pokemonStore.limit;
        pokemonStore.offset = newOffset;
        pokemonStore.fetchPokemonList();
    };

    const handleLimitChange = (newLimit) => {
        pokemonStore.setLimit(newLimit);
        pokemonStore.offset = 0; // Сбрасываем на первую страницу
        pokemonStore.fetchPokemonList();
    };

    useEffect(() => {
        const initialize = async () => {
            await pokemonStore.fetchTotalPokemonCount();
            await pokemonStore.fetchPokemonList();
            await pokemonStore.fetchAllPokemonData();
            await pokemonStore.fetchPokemonByType();
        }
        initialize();
    }, []);

    const debouncedSearch = debounce((query) => {
        pokemonStore.updateSearchQuery(query);
        pokemonStore.searchPokemons();
    }, 100);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchTerm(query);
        debouncedSearch(query);
    };

    return (
        <div>
            {/* Контейнер для поиска и пагинации */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                marginBottom: '20px'
            }}>
                {/* Пагинация слева */}
                <div style={{ flex: '1 1 auto', minWidth: '300px' }}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrev={() => pokemonStore.goToPrevPage()}
                        onNext={() => pokemonStore.goToNextPage()}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                        isPrevDisabled={pokemonStore.offset === 0}
                        isNextDisabled={pokemonStore.offset + pokemonStore.limit >= pokemonStore.pokemonCount}
                        currentLimit={pokemonStore.limit}
                    />
                </div>

                {/* Поле поиска справа */}
                <input
                    type="text"
                    placeholder="Pokemon search..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        padding: "8px",
                        width: "100%",
                        maxWidth: "300px",
                        flexShrink: 0
                    }}
                />
            </div>
            {/* Поле выбора типа для поиска */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {allTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => pokemonStore.togglePokemonTypeFilter(type)}
                        style={{
                            padding: "8px 12px",
                            border: `2px solid ${typeColors[type]}`, // Используем цвет типа для границы
                            backgroundColor: pokemonStore.selectedTypes.includes(type)
                                ? typeColors[type] // Если тип выбран - цвет типа
                                : "transparent", // Если не выбран - прозрачный фон
                            color: pokemonStore.selectedTypes.includes(type)
                                ? "#fff" // Белый текст для выбранных типов
                                : typeColors[type], // Цвет типа для невыбранных
                            cursor: "pointer",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            transition: "all 0.2s ease",
                            fontWeight: pokemonStore.selectedTypes.includes(type) ? "bold" : "normal",
                            position: "relative"
                        }}
                    >
                        {type}
                    </button>
                ))}
                {/* Кнопка для сброса фильтра */}
                <button
                    onClick={() => pokemonStore.togglePokemonTypeFilter(null)}
                    style={{
                        padding: "8px 12px",
                        border: "1px solid #ddd",
                        backgroundColor: pokemonStore.selectedTypes === null ? "#007bff" : "#fff",
                        color: pokemonStore.selectedTypes === null ? "#fff" : "#000",
                        cursor: "pointer",
                        borderRadius: "5px"
                    }}
                >
                    All
                </button>
            </div>

            {/* Сетка покемонов */}
            <div style={{
                display: "grid",
                gap: "20px",
                justifyContent: "center",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            }}>
                {pokemonStore.pokemons.map((pokemon) => (
                    <PokemonCard key={pokemon.name} {...pokemon} />
                ))}
            </div>
        </div>
    );
});


export default PokemonList;