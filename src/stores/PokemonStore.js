import { makeAutoObservable } from 'mobx';
import {fetchPokemonDetails, fetchPokemonList, getPokemonMaxCount} from '../api/pokemonAPI';
import pokeball from "../assets/pokeball.jpg";

class PokemonStore {

    pokemons = []; // Список загруженных покемонов для отображения
    allPokemons = []; // Полный список имен покемонов (используется для поиска)
    limit = 10; // Количество покемонов на одной странице
    offset = 0;  // Текущий сдвиг (offset) для пагинации
    isLoading = false;  // Флаг загрузки данных
    error = null;  // Сообщение об ошибке
    pokemonCount = 0; // Общее количество покемонов
    pokemonMaxCount = 0;  // Максимальное количество покемонов, доступных в API
    searchQuery = "";  // Строка поиска
    isFullDataLoaded = false;   // Флаг, указывающий, загружены ли все покемоны (для поиска)

    constructor() {
        makeAutoObservable(this);
    }

    // Загружает общее количество покемонов
    async loadPokemonMaxCount() {
        this.pokemonMaxCount = await getPokemonMaxCount();
        this.pokemonCount = this.pokemonMaxCount;
    }

    // Загружает полный список покемонов (используется для поиска)
    async loadFullData() {
        try {
            const payload = {
                limit: this.pokemonMaxCount,
                offset: 0
            };
            const data = await fetchPokemonList(payload); // Загружаем всех покемонов
            this.allPokemons = data; // Сохраняем полный список
            this.isFullDataLoaded = true;
        } catch (error) {
            console.error("Ошибка загрузки полного списка:", error);
        }
    }

    // Загружает покемонов с учетом пагинации и поиска
    async loadPokemons() {
        this.isLoading = true;
        try {
            let pokemonList;

            // Если загружены все данные и есть поисковый запрос
            if (this.isFullDataLoaded && this.searchQuery) {
                let filtered = this.allPokemons.filter(p => p.name.includes(this.searchQuery));
                this.pokemonCount = filtered.length; // Обновляем количество найденных покемонов
                filtered = filtered.slice(this.offset, this.offset + this.limit); // Применяем пагинацию

                // Загружаем данные по отфильтрованным покемонам
                pokemonList = await Promise.all(filtered.map(async (p) => {
                    const data = await fetchPokemonDetails(p.url);
                    return this.processPokemonData(data);
                }));
            } else {
                // Если поиск не используется, загружаем покемонов по стандартному API
                this.pokemonCount = this.pokemonMaxCount;
                const payload = {
                    limit: this.limit,
                    offset: this.offset
                };
                const data = await fetchPokemonList(payload);

                // Загружаем подробные данные о покемонах
                pokemonList = await Promise.all(data.map(async (p) => {
                    const pokemonData = await fetchPokemonDetails(p.url);
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

    // Обрабатывает данные о покемоне, извлекая нужные параметры
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

    // Устанавливает строку поиска и сбрасывает offset
    setSearchQuery(query) {
        this.searchQuery = query.toLowerCase();
        this.offset = 0;
    }

    // Устанавливает лимит покемонов на странице
    setLimit(limit) {
        this.limit = limit;
    }

    // Применяет поиск, загружая покемонов по строке поиска
    applySearch() {
        if (this.isFullDataLoaded) {
            this.loadPokemons();
        } else {
            alert("Полный список еще загружается. Попробуйте позже.");
        }
    }

    // Переход на следующую страницу
    nextPage() {
        this.offset += this.limit;
        this.loadPokemons();
    }

    // Переход на предыдущую страницу
    prevPage() {
        this.offset = Math.max(0, this.offset - this.limit);
        this.loadPokemons();
    }
}

export default new PokemonStore();
