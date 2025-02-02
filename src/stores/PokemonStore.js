import { makeAutoObservable } from 'mobx';
import { fetchPokemonList, getPokemonCount } from '../api/pokemonAPI';
import axios from 'axios';
import pokeball from "../assets/pokeball.jpg";

class PokemonStore {
    pokemons = [];          // Обычный список покемонов (для стандартного отображения)
    filteredPokemons = [];  // Временный список покемонов при поиске
    allPokemons = [];       // Полный список имен покемонов
    limit = 10;
    offset = 0;
    isLoading = false;
    error = null;
    pokemonCount = 0;
    searchQuery = "";
    isFullDataLoaded = false;
    isSearching = false;

    constructor() {
        makeAutoObservable(this);
        this.loadInitialData();
        this.loadFullData();
    }

    async loadInitialData() {
        await this.loadPokemonCount();
        await this.loadPokemons();
    }

    async loadPokemonCount() {
        this.pokemonCount = await getPokemonCount();
    }

    async loadFullData() {
        this.allPokemons = fetchPokemonList(this.loadPokemonCount(), this.offset);
        this.isFullDataLoaded = true;
    }

    async loadPokemons() {
        this.isLoading = true;
        try {
            let pokemonList;

            if (this.isFullDataLoaded && this.searchQuery) {
                const filtered = this.allPokemons.filter(p =>
                    p.name.includes(this.searchQuery)
                ).slice(this.offset, this.offset + this.limit);

                pokemonList = await Promise.all(filtered.map(async (p) => {
                    const response = await axios.get(p.url);
                    return this.processPokemonData(response.data);
                }));
            } else {
                const data = await fetchPokemonList(this.limit, this.offset);
                pokemonList = await Promise.all(data.map(async (p) => {
                    const response = await axios.get(p.url);
                    return this.processPokemonData(response.data);
                }));
            }

            this.pokemons = pokemonList;
        } catch (err) {
            this.error = err.message;
        } finally {
            this.isLoading = false;
        }
    }

    processPokemonData(data) {
        return {
            name: data.name,
            image: data.sprites.other["official-artwork"].front_default || pokeball,
            types: data.types.map(t => t.type.name),
            stats: {
                hp: data.stats.find(s => s.stat.name === "hp")?.base_stat || 0,
                defense: data.stats.find(s => s.stat.name === "defense")?.base_stat || 0,
                speed: data.stats.find(s => s.stat.name === "speed")?.base_stat || 0,
            }
        };
    }

    setSearchQuery(query) {
        this.searchQuery = query.toLowerCase();
        this.offset = 0;
    }

    applySearch() {
        if (this.isFullDataLoaded) {
            this.loadPokemons();
        } else {
            alert("Полный список еще загружается. Попробуйте позже.");
        }
    }

    nextPage() {
        this.offset += this.limit;
        this.loadPokemons();
    }

    prevPage() {
        this.offset = Math.max(0, this.offset - this.limit);
        this.loadPokemons();
    }
}

export default new PokemonStore();