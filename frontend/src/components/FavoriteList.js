import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import pokemonStore from "../stores/PokemonStore";
import PokemonCard from "./PokemonCard";
import Pagination from "./Pagination";
import { debounce } from "lodash";

const FavoriteList = observer(() => {
    const [searchTerm, setSearchTerm] = useState("");
    const [totalPages, setTotalPages] = useState(1); // Локальный стейт для страниц

    // Массив избранных покемонов (взято из профиля пользователя)
    const favoritePokemons = pokemonStore.favorites;

    const currentPage = Math.floor(pokemonStore.offset / pokemonStore.limit) + 1;

    // Обновляем totalPages, когда изменяется количество покемонов
    useEffect(() => {
        setTotalPages(Math.max(1, Math.ceil(favoritePokemons.length / pokemonStore.limit)));
    }, [favoritePokemons.length, pokemonStore.limit]);

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
                        totalPages={totalPages} // Используем обновленный стейт
                        onPrev={() => pokemonStore.goToPrevPage()}
                        onNext={() => pokemonStore.goToNextPage()}
                        onPageChange={(page) => {
                            const newOffset = (page - 1) * pokemonStore.limit;
                            pokemonStore.offset = newOffset;
                            pokemonStore.fetchPokemonList();
                        }}
                        onLimitChange={(newLimit) => {
                            pokemonStore.setLimit(newLimit);
                            pokemonStore.offset = 0;
                            pokemonStore.fetchPokemonList();
                        }}
                        isPrevDisabled={pokemonStore.offset === 0}
                        isNextDisabled={pokemonStore.offset + pokemonStore.limit >= favoritePokemons.length}
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
                        const debounced = debounce(() => pokemonStore.updateSearchQuery(query), 300);
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

            {/* Список покемонов */}
            <div style={{ display: "grid", gap: "20px", justifyContent: "center", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
                {favoritePokemons.length > 0 ? (
                    favoritePokemons
                        .slice(pokemonStore.offset, pokemonStore.offset + pokemonStore.limit)
                        .map((pokemon) => (
                            <PokemonCard key={pokemon.name} {...pokemon} />
                        ))
                ) : (
                    <p>No favorite pokemons yet...</p>
                )}
            </div>
        </div>
    );
});

export default FavoriteList;