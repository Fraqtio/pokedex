import {makeAutoObservable, runInAction} from 'mobx';
import {fetchPokemonDetails, fetchPokemonList, fetchPokemonListByType, getPokemonMaxCount} from '../api/pokemonAPI';
import pokeball from "../assets/pokeball.jpg";
import {allTypes} from "../constants/pokeTypes";

class PokemonStore {

    pokemons = []; // Список загруженных покемонов для отображения
    allPokemons = []; // Полный список имен покемонов (используется для поиска)
    pokemonByType = new Map(); // Полный список имен покемонов по типам (используется для поиска)
    selectedTypes = []; // Выбранные тип покемона
    limit = 10; // Количество покемонов на одной странице
    offset = 0;  // Текущий сдвиг (offset) для пагинации
    isLoading = false;  // Флаг загрузки данных
    error = null;  // Сообщение об ошибке
    pokemonCount = 0; // Общее количество покемонов в текущей выборке
    pokemonMaxCount = 0;  // Максимальное количество покемонов, доступных в API
    searchQuery = "";  // Строка поиска
    isFullDataLoaded = false;   // Флаг, указывающий, загружены ли все покемоны (для поиска)
    favorites = new Set();

    constructor() {
        makeAutoObservable(this);
    }

    // Загружает общее количество покемонов
    async fetchTotalPokemonCount() {
        const maxCount = await getPokemonMaxCount();

        runInAction(() => {
            this.pokemonMaxCount = maxCount;
            this.pokemonCount = maxCount;
        });
    }

    // Загружает полный список покемонов (используется для поиска)
    async fetchAllPokemonData() {
        try {
            const payload = { limit: this.pokemonMaxCount, offset: 0 };
            const data = await fetchPokemonList(payload);

            runInAction(() => {
                this.allPokemons = data;
                this.isFullDataLoaded = true;
            });

        } catch (error) {
            console.error("Ошибка загрузки полного списка:", error);
        }
    }

    async fetchPokemonByType() {
        for (let i = 0; i < allTypes.length; i++) {
            const typeName = allTypes[i];
            try {
                const responseData = await fetchPokemonListByType(i + 1);

                // Проверяем корректность данных
                if (!Array.isArray(responseData)) {
                    console.error(`Некорректный формат данных для типа ${typeName}:`, responseData);
                    continue;
                }

                // Сохраняем только имя и URL покемона
                const pokemonList = responseData.map(({ pokemon }) => ({
                    name: pokemon.name,
                    url: pokemon.url
                }));

                // Записываем в хэш-мапу
                this.pokemonByType.set(typeName, pokemonList);

            } catch (error) {
                console.error(`Ошибка загрузки для типа ${typeName}:`, error);
            }
        }
    }

    async fetchUserFavorites() {
        try {
            const response = await fetch('http://localhost:5000/favorites', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            runInAction(() => {
                this.favorites.clear();  // Очищаем старое содержимое
                data.forEach(pokemon => this.favorites.add(pokemon));  // Добавляем новые элементы
            });
        } catch (error) {
            console.error("Ошибка загрузки избранных покемонов:", error);
        }
    }

    async toggleFavorite(pokemonName) {
        const method = this.favorites.has(pokemonName) ? "DELETE" : "POST";

        try {
            const response = await fetch(`http://localhost:5000/favorites/${pokemonName}`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                runInAction(() => { // Оборачиваем изменение состояния в runInAction
                    if (this.favorites.has(pokemonName)) {
                        this.favorites.delete(pokemonName);
                    } else {
                        this.favorites.add(pokemonName);
                    }
                });
            } else {
                console.error("Ошибка при изменении избранного");
            }
        } catch (error) {
            console.error("Ошибка сети:", error);
        }
    }

    // Загружает покемонов с учетом пагинации и поиска
    async fetchPokemonList() {
        runInAction(() => { this.isLoading = true; });

        try {
            let pokemonList;

            if ((this.isFullDataLoaded && this.searchQuery) || (this.selectedTypes.length > 0)) {
                let filtered = Array.isArray(this.allPokemons) ? this.allPokemons : [];

                if (this.isFullDataLoaded && this.searchQuery) {
                    filtered = filtered.filter(p => p.name.includes(this.searchQuery));
                }

                if (this.selectedTypes.length > 0) {
                    const typePokemons = this.selectedTypes.map(type =>
                        this.pokemonByType.get(type) || []
                    );

                    const fullMatch = typePokemons.reduce((acc, curr) =>
                            acc.filter(p => curr.some(cp => cp.name === p.name)),
                        typePokemons[0] || []
                    );

                    const partialMatch = this.selectedTypes
                        .flatMap(type => this.pokemonByType.get(type) || [])
                        .filter(p => !fullMatch.some(fm => fm.name === p.name));

                    const combinedResults = [...fullMatch, ...partialMatch];

                    filtered = combinedResults.filter(p =>
                        filtered.some(fp => fp.name === p.name)
                    );
                }

                runInAction(() => { this.pokemonCount = filtered.length; });

                filtered = filtered.slice(this.offset, this.offset + this.limit);
                pokemonList = await Promise.all(filtered.map(async (p) => {
                    const data = await fetchPokemonDetails(p.url);
                    return this.mapPokemonDetails(data);
                }));

            } else {
                runInAction(() => { this.pokemonCount = this.pokemonMaxCount; });

                const payload = { limit: this.limit, offset: this.offset };
                const data = await fetchPokemonList(payload);

                pokemonList = await Promise.all(data.map(async (p) => {
                    const pokemonData = await fetchPokemonDetails(p.url);
                    return this.mapPokemonDetails(pokemonData);
                }));
            }

            runInAction(() => {
                this.pokemons = pokemonList;
                this.isLoading = false;
            });

        } catch (err) {
            runInAction(() => {
                this.error = err.message;
                this.isLoading = false;
            });
        }
    }

    async fetchFavoritePokemons() {
        runInAction(() => { this.isLoading = true; });
        try {
            if (this.allPokemons.length === 0) {
                await this.fetchAllPokemonData(); // Догружаем при необходимости
            }

            // 1️⃣ Получаем объекты покемонов из `allPokemons`, используя `this.favorites`
            let filteredFavorites = this.allPokemons.filter(pokemon =>
                this.favorites.has(pokemon.name)
            );

            // 2️⃣ Фильтрация по поиску
            if (this.isFullDataLoaded && this.searchQuery) {
                filteredFavorites = filteredFavorites.filter(pokemon =>
                    pokemon.name.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }

            // 3️⃣ Фильтрация по типам (если выбраны)
            if (this.selectedTypes.length > 0) {
                const typePokemons = this.selectedTypes.map(type =>
                    this.pokemonByType.get(type) || []
                );

                const fullMatch = typePokemons.reduce((acc, curr) =>
                        acc.filter(p => curr.some(cp => cp.name === p.name)),
                    typePokemons[0] || []
                );

                const partialMatch = this.selectedTypes
                    .flatMap(type => this.pokemonByType.get(type) || [])
                    .filter(p => !fullMatch.some(fm => fm.name === p.name));

                const combinedResults = [...fullMatch, ...partialMatch];

                filteredFavorites = combinedResults.filter(pokemon =>
                    filteredFavorites.some(fav => fav.name === pokemon.name)
                );
            }

            // 4️⃣ Применяем пагинацию
            runInAction(() => {
                this.pokemonCount = filteredFavorites.length;
            });

            const paginatedFavorites = filteredFavorites.slice(this.offset, this.offset + this.limit);

            // 5️⃣ Загружаем детали покемонов
            const pokemonList = await Promise.all(paginatedFavorites.map(async (pokemon) => {
                const data = await fetchPokemonDetails(pokemon.url);
                return this.mapPokemonDetails(data);
            }));

            runInAction(() => {
                this.pokemons = pokemonList;
            });

        } catch (err) {
            runInAction(() => {
                this.error = err.message;
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    clearPokemons() {
        runInAction(() => {
            this.pokemons = [];
        });
    }

    // Обрабатывает данные о покемоне, извлекая нужные параметры
    mapPokemonDetails(data) {
        return {
            name: data.name,
            image: data.sprites.other["official-artwork"].front_default || pokeball,
            types: data.types.map(t => t.type.name),
            stats: {
                hp: data.stats.find(s => s.stat.name === "hp")?.base_stat || 0,
                defense: data.stats.find(s => s.stat.name === "defense")?.base_stat || 0,
                speed: data.stats.find(s => s.stat.name === "speed")?.base_stat || 0,
            },
            abilities: data.abilities.map(a => a.ability.name)
        };
    }

    // Устанавливает строку поиска и сбрасывает offset
    updateSearchQuery(query) {
        runInAction(() => {
            this.searchQuery = query.toLowerCase();
            this.offset = 0;
        });
        this.fetchPokemonList(); // Добавляем вызов
    }

    updateSearchQueryProfile(query) {
        runInAction(() => {
            this.searchQuery = query.toLowerCase(); // Обновляем поисковый запрос
            this.offset = 0; // Сбрасываем пагинацию
        });
        this.fetchUserFavorites(); // Вызываем загрузку избранных покемонов с новым поисковым запросом
    }

    // Устанавливает лимит покемонов на странице
    setLimit(newLimit) {
        runInAction(() => {
            this.limit = newLimit;
            this.offset = 0;  // если меняется лимит, сбрасываем offset
        });
    }

    setOffset(newOffset) {
        runInAction(() => {
            this.offset = newOffset;
        });
    }

    togglePokemonTypeFilter(type) {
        // Очищаем при выборе кнопки "All"
        if (type === null) {
            this.selectedTypes = [];
        }
        // Если тип уже выбран - удаляем его
        else if (this.selectedTypes.includes(type)) {
            this.selectedTypes = this.selectedTypes.filter(t => t !== type);
        }
        // Если не выбран и меньше 2 выбранных - добавляем
        else if (this.selectedTypes.length < 2) {
            this.selectedTypes = [...this.selectedTypes, type];
        }
        // Если уже выбрано 2 типа - заменяем первый
        else {
            this.selectedTypes = [this.selectedTypes[1], type];
        }
        this.fetchPokemonList();
    }

    toggleFavoriteTypeFilter(type) {
        // Очищаем при выборе кнопки "All"
        if (type === null) {
            this.selectedTypes = [];
        }
        // Если тип уже выбран - удаляем его
        else if (this.selectedTypes.includes(type)) {
            this.selectedTypes = this.selectedTypes.filter(t => t !== type);
        }
        // Если не выбран и меньше 2 выбранных - добавляем
        else if (this.selectedTypes.length < 2) {
            this.selectedTypes = [...this.selectedTypes, type];
        }
        // Если уже выбрано 2 типа - заменяем первый
        else {
            this.selectedTypes = [this.selectedTypes[1], type];
        }

        this.fetchFavoritePokemons(); // Загружаем избранных покемонов с новым фильтром
    }

    // Переход на следующую страницу
    goToNextPage() {
        runInAction(() => {
            this.offset += this.limit;
            this.fetchPokemonList();
        });

    }

    goToPrevPage() {
        runInAction(() => {
            this.offset = Math.max(0, this.offset - this.limit);
            this.fetchPokemonList();
        });

    }
}

const pokemonStoreInstance = new PokemonStore();
export default pokemonStoreInstance;
