import { useEffect } from "react";
import pokemonStore from "../stores/PokemonStore"; // Импортируем PokemonStore

const PokemonInitializer = () => {
    useEffect(() => {
        let isMounted = true; // Флаг, чтобы отслеживать монтирование компонента

        const initialize = async () => {
            if (!isMounted) return; // Если компонент размонтирован, не выполняем дальнейшие действия

            try {
                // 1. Загружаем общее количество покемонов
                await pokemonStore.fetchTotalPokemonCount();

                // 2. Загружаем полный список для поиска
                await pokemonStore.fetchAllPokemonData();

                // 3. Загружаем данные по типам
                await pokemonStore.fetchPokemonByType();

                // 4. Загружаем первую страницу покемонов
                await pokemonStore.fetchPokemonList();

                // 5. Загружаем любимых покемонов, если есть токен
                if (localStorage.getItem("token")) {
                    await pokemonStore.fetchUserFavorites();
                }

            } catch (err) {
                console.error("Ошибка инициализации:", err);
            }
        };

        initialize();

        // Убираем флаг при размонтировании компонента
        return () => {
            isMounted = false;
        };

    }, []); // Пустой массив зависимостей, чтобы запускался только один раз при монтировании компонента

    return null; // Не отображаем ничего, это только для инициализации
};

export default PokemonInitializer;