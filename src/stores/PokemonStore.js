import { makeAutoObservable } from 'mobx';
import {fetchPokemonDetails, fetchPokemonList, getPokemonMaxCount} from '../api/pokemonAPI';
import pokeball from "../assets/pokeball.jpg";

class PokemonStore {
    pokemons = [];          // Обычный список покемонов (для стандартного отображения)
    allPokemons = [];       // Полный список имен покемонов
    limit = 10;
    offset = 0;
    isLoading = false;
    error = null;
    pokemonCount = 0;
    pokemonMaxCount = 0;
    searchQuery = "";
    isFullDataLoaded = false;

    constructor() {
        makeAutoObservable(this);
    }

    async loadPokemonMaxCount() {
        this.pokemonMaxCount = await getPokemonMaxCount();
        this.pokemonCount = this.pokemonMaxCount;
    }

    async loadFullData() {
        try {
            const payload = {
                limit: this.pokemonMaxCount,
                offset: 0
            }
            const data = await fetchPokemonList(payload); // Загружаем всех покемонов
            this.allPokemons = data; // Теперь это массив объектов { name, url }
            this.isFullDataLoaded = true;
        } catch (error) {
            console.error("Ошибка загрузки полного списка:", error);
        }
    }

    async loadPokemons() {
        this.isLoading = true;
        try {
            let pokemonList;

            if (this.isFullDataLoaded && this.searchQuery) {
                let filtered = this.allPokemons
                    .filter(p => p.name.includes(this.searchQuery));
                this.pokemonCount = filtered.length;
                filtered = filtered.slice(this.offset, this.offset + this.limit);
                pokemonList = await Promise.all(filtered.map(async (p) => {
                    const data = await fetchPokemonDetails(p.url);
                    return this.processPokemonData(data);
                }));
            } else {
                const payload = {
                    limit: this.limit,
                    offset: this.offset
                }
                const data = await fetchPokemonList(payload);
                pokemonList = await Promise.all(data.map(async (p) => {
                    const pokemonData = await fetchPokemonDetails(p.url); // Ожидаем данные
                    return this.processPokemonData(pokemonData);
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

    setLimit(limit) {
        this.limit = limit;
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