import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import pokemonStore from "../stores/PokemonStore";
import PokemonCard from "./PokemonCard";
import Pagination from "./Pagination";
import { debounce } from "lodash";
import { allTypes, typeColors } from "../constants/pokeTypes";

const FavoriteList = observer(() => {
    const [searchTerm, setSearchTerm] = useState("");

    // Получаем примитивные значения из стора
    const currentPage = Math.floor(pokemonStore.offset / pokemonStore.limit) + 1;
    const totalPages = Math.max(1, Math.ceil(pokemonStore.pokemonCount / pokemonStore.limit));

    // Деструктурируем нужные примитивы
    const {
        searchQuery,
        selectedTypes,
        offset,
        limit,
        pokemonCount
    } = pokemonStore;

    const serializedTypes = JSON.stringify(selectedTypes);

    useEffect(() => {
        pokemonStore.fetchFavoritePokemons();
        // Используем только примитивные зависимости
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        searchQuery,
        serializedTypes, // Сериализуем массив для сравнения
        offset,
        limit,
        pokemonCount
    ]);

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
                            pokemonStore.fetchFavoritePokemons();
                        }}
                        onLimitChange={(newLimit) => {
                            pokemonStore.setLimit(newLimit);
                            pokemonStore.fetchFavoritePokemons();
                        }}
                        isPrevDisabled={pokemonStore.offset === 0}
                        isNextDisabled={pokemonStore.offset + pokemonStore.limit >= pokemonStore.pokemonCount}
                        currentLimit={pokemonStore.limit}
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
                        const debounced = debounce(() => pokemonStore.updateSearchQueryProfile(query), 300);
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
                        onClick={() => pokemonStore.toggleFavoriteTypeFilter(type)}
                        style={{
                            padding: "8px 12px",
                            border: `2px solid ${typeColors[type]}`,
                            backgroundColor: pokemonStore.selectedTypes.includes(type) ? typeColors[type] : "transparent",
                            color: pokemonStore.selectedTypes.includes(type) ? "#fff" : typeColors[type],
                            cursor: "pointer",
                            borderRadius: "20px",
                            textTransform: "capitalize",
                            transition: "all 0.2s ease",
                            fontWeight: pokemonStore.selectedTypes.includes(type) ? "bold" : "normal",
                        }}
                    >
                        {type}
                    </button>
                ))}
                <button
                    onClick={() => pokemonStore.toggleFavoriteTypeFilter(null)}
                    style={{
                        padding: "8px 12px",
                        border: "1px solid #ddd",
                        backgroundColor: pokemonStore.selectedTypes === null ? "#007bff" : "#fff",
                        color: pokemonStore.selectedTypes === null ? "#fff" : "#000",
                        cursor: "pointer",
                        borderRadius: "5px",
                    }}
                >
                    All
                </button>
            </div>

            {/* Список избранных покемонов */}
            <div style={{ display: "grid", gap: "20px", justifyContent: "center", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
                {pokemonStore.pokemons.length > 0 ? (
                    pokemonStore.pokemons.map((pokemon) => (
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