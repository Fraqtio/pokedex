import { makeAutoObservable, runInAction } from 'mobx';
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

    // Загружает покемонов с учетом пагинации и поиска
    async fetchPokemonList() {
        this.isLoading = true;
        try {
            let pokemonList;

            if ((this.isFullDataLoaded && this.searchQuery) || (this.selectedTypes.length > 0)) {
                let filtered = this.allPokemons;

                if (this.isFullDataLoaded && this.searchQuery) {
                    filtered = filtered.filter(p => p.name.includes(this.searchQuery));
                }

                if (this.selectedTypes.length > 0) {
                    // Получаем массивы покемонов для каждого выбранного типа
                    const typePokemons = this.selectedTypes.map(type =>
                        this.pokemonByType.get(type) || []
                    );

                    // Находим пересечение всех массивов
                    filtered = typePokemons.reduce((acc, curr) =>
                            acc.filter(p => curr.some(cp => cp.name === p.name)),
                        typePokemons[0] || []
                    );

                    // Оставляем только базовую информацию для последующей загрузки
                    filtered = filtered.map(p => ({name: p.name, url: p.url}));
                }

                runInAction(() => {
                    this.pokemonCount = filtered.length; // <-- оборачиваем изменение в runInAction
                });

                filtered = filtered.slice(this.offset, this.offset + this.limit); // Применяем пагинацию

                pokemonList = await Promise.all(filtered.map(async (p) => {
                    const data = await fetchPokemonDetails(p.url);
                    return this.mapPokemonDetails(data);
                }));

            } else {
                runInAction(() => {
                    this.pokemonCount = this.pokemonMaxCount; // <-- тоже оборачиваем
                });

                const payload = {
                    limit: this.limit,
                    offset: this.offset
                };
                const data = await fetchPokemonList(payload);

                pokemonList = await Promise.all(data.map(async (p) => {
                    const pokemonData = await fetchPokemonDetails(p.url);
                    return this.mapPokemonDetails(pokemonData);
                }));
            }

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
            }
        };
    }

    // Устанавливает строку поиска и сбрасывает offset
    updateSearchQuery(query) {
        this.searchQuery = query.toLowerCase();
        this.offset = 0;
    }

    // Устанавливает лимит покемонов на странице
    setLimit(limit) {
        this.limit = limit;
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

    // Применяет поиск, загружая покемонов по строке поиска
    searchPokemons() {
        if (this.isFullDataLoaded) {
            this.fetchPokemonList();
        } else {
            alert("Полный список еще загружается. Попробуйте позже.");
        }
    }

    // Переход на следующую страницу
    goToNextPage() {
        this.offset += this.limit;
        this.fetchPokemonList();
    }

    // Переход на предыдущую страницу
    goToPrevPage() {
        this.offset = Math.max(0, this.offset - this.limit);
        this.fetchPokemonList();
    }
}

const pokemonStoreInstance = new PokemonStore();
export default pokemonStoreInstance;
