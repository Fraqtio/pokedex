import { useEffect } from "react";
import pokemonStore from "../stores/PokemonStore";
import {useLocation} from "react-router-dom"; // Импортируем PokemonStore

const PokemonInitializer = () => {
    const location = useLocation();

    useEffect(() => {
        let isMounted = true; // Флаг, чтобы отслеживать монтирование компонента

        const initialize = async () => {
            if (!isMounted) return; // Если компонент размонтирован, не выполняем дальнейшие действия

            try {
                // Загружаем общее количество покемонов
                await pokemonStore.fetchTotalPokemonCount();

                await pokemonStore.checkAuth();
                // Загружаем данные по типам
                await pokemonStore.fetchPokemonByType();

                await pokemonStore.fetchAllPokemonData();
                // Если мы не на странице профиля, загружаем полный список покемонов
                if (!location.pathname.includes("/profile")) {
                    await pokemonStore.fetchPokemonList();
                }

                // Загружаем избранных покемонов, если есть токен
                if (localStorage.getItem("token")) {
                    await pokemonStore.fetchUserFavorites();
                }

            } catch (err) {
                console.error("Init error:", err);
            }
        };
        initialize();

        // Убираем флаг при размонтировании компонента
        return () => {
            isMounted = false;
        };

    }, [location.pathname]); // Пустой массив зависимостей, чтобы запускался только один раз при монтировании компонента

    return null; // Не отображаем ничего, это только для инициализации
};

export default PokemonInitializer;