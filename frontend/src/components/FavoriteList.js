import { observer } from "mobx-react-lite";
import {useEffect, useMemo, useState} from "react";
import pokemonStore from "../stores/PokemonStore";
import PokemonCard from "./PokemonCard";
import Pagination from "./Pagination";
import { debounce } from "lodash";
import { allTypes, typeColors } from "../constants/pokeTypes";

const FavoriteList = observer(() => {
    const [searchTerm, setSearchTerm] = useState("");

    const {
        searchQuery,
        selectedTypes,
        offset,
        limit,
        pokemonCount,
        pokemons,
        fetchFavoritePokemons,
        toggleFavoriteTypeFilter,
        updateSearchQueryProfile
    } = pokemonStore;

    const currentPage = useMemo(() =>
            Math.floor(offset / limit) + 1,
        [offset, limit]
    );

    const totalPages = useMemo(() =>
            Math.max(1, Math.ceil(pokemonCount / limit)),
        [pokemonCount, limit]
    );

    // Эффект для загрузки данных при изменении параметров
    useEffect(() => {
        fetchFavoritePokemons();
    }, [searchQuery, selectedTypes, offset, limit, fetchFavoritePokemons]);

    // Эффект для поиска с debounce
    useEffect(() => {
        const debouncedSearch = debounce(() => {
            updateSearchQueryProfile(searchTerm.toLowerCase());
        }, 300);

        debouncedSearch();

        return () => debouncedSearch.cancel();
    }, [searchTerm, updateSearchQueryProfile]);

    return (
        <div>
            {/* Поиск и пагинация */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                }}
            >
                <div style={{ width: "300px" }}></div>

                {/* Пагинация по центру */}
                <div style={{ display: "flex", justifyContent: "center", flex: "1" }}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages} // Используем pokemonStore.pokemonCount
                        onPrev={() => pokemonStore.goToPrevPage()}
                        onNext={() => pokemonStore.goToNextPage()}
                        onPageChange={(page) => {
                            const newOffset = (page - 1) * pokemonStore.limit;
                            pokemonStore.setOffset(newOffset);
                            fetchFavoritePokemons();
                        }}
                        onLimitChange={(newLimit) => {
                            pokemonStore.setLimit(newLimit);
                            fetchFavoritePokemons();
                        }}
                        isPrevDisabled={offset === 0}
                        isNextDisabled={offset + limit >= pokemonCount}
                        currentLimit={limit}
                    />
                </div>

                {/* Поле поиска справа */}
                <input
                    type="text"
                    placeholder="Search favorites..."
                    value={searchTerm}
                    onChange={(e) => {
                        const query = e.target.value.toLowerCase();
                        setSearchTerm(query);
                        const debounced = debounce(() => updateSearchQueryProfile(query), 300);
                        debounced();
                    }}
                    style={{
                        padding: "8px",
                        width: "100%",
                        maxWidth: "300px",
                        flexShrink: 0,
                    }}
                />
            </div>

            {/* Фильтрация по типам */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
                {allTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => toggleFavoriteTypeFilter(type)}
                        style={{
                            padding: "8px 12px",
                            border: `2px solid ${typeColors[type]}`,
                            backgroundColor: selectedTypes.includes(type) ? typeColors[type] : "transparent",
                            color: selectedTypes.includes(type) ? "#fff" : typeColors[type],
                            cursor: "pointer",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            transition: "all 0.2s ease",
                            fontWeight: selectedTypes.includes(type) ? "bold" : "normal",
                        }}
                    >
                        {type}
                    </button>
                ))}
                <button
                    onClick={() => toggleFavoriteTypeFilter(null)}
                    style={{
                        padding: "8px 12px",
                        border: "1px solid #ddd",
                        backgroundColor: selectedTypes === null ? "#007bff" : "#fff",
                        color: selectedTypes === null ? "#fff" : "#000",
                        cursor: "pointer",
                        borderRadius: "5px",
                    }}
                >
                    All
                </button>
            </div>

            {/* Список избранных покемонов */}
            <div style={{ display: "grid", gap: "20px", justifyContent: "center", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
                {pokemons.length > 0 ? (
                    pokemons.map((pokemon) => (
                        <PokemonCard key={pokemon.name} {...pokemon} />
                    ))
                ) : (
                    <p>There is nothing in here...</p>
                )}
            </div>
        </div>
    );
});

export default FavoriteList;