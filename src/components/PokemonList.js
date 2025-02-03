import { observer } from "mobx-react-lite";
import { useEffect, useState } from 'react';
import pokemonStore from "../stores/PokemonStore";
import PokemonCard from "./PokemonCard";
import Pagination from "../components/Pagination";
import { debounce } from 'lodash';

const PokemonList = observer(() => {
    const [searchTerm, setSearchTerm] = useState("");
    const currentPage = Math.floor(pokemonStore.offset / pokemonStore.limit) + 1;
    const totalPages = Math.max(1, Math.ceil(pokemonStore.pokemonCount / pokemonStore.limit));

    const handlePageChange = (page) => {
        const newOffset = (page - 1) * pokemonStore.limit;
        pokemonStore.offset = newOffset;
        pokemonStore.loadPokemons();
    };

    const handleLimitChange = (newLimit) => {
        pokemonStore.setLimit(newLimit);
        pokemonStore.offset = 0; // Сбрасываем на первую страницу
        pokemonStore.loadPokemons();
    };

    useEffect(() => {
        const initialize = async () => {
            await pokemonStore.loadPokemonMaxCount();
            await pokemonStore.loadPokemons();
            await pokemonStore.loadFullData();
        }

        initialize();

    }, []);

    const debouncedSearch = debounce((query) => {
        pokemonStore.setSearchQuery(query);
        pokemonStore.applySearch();
    }, 300);

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
                        onPrev={() => pokemonStore.prevPage()}
                        onNext={() => pokemonStore.nextPage()}
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
                    placeholder="Поиск покемона..."
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