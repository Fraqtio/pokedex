import React, { useEffect, useState } from "react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import FavoriteList from "../components/FavoriteList";
import pokemonStore from "../stores/PokemonStore";

const Profile = () => {
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Проверяем наличие токена в localStorage
                const storedToken = localStorage.getItem("token");

                // Запрашиваем данные о пользователе
                const response = await axios.get("http://localhost:5000/user", {
                    headers: {Authorization: `Bearer ${storedToken}`},
                });
                await pokemonStore.fetchUserFavorites();
                setUser(response.data);

            } catch (err) {
                console.error("Ошибка загрузки данных:", err);
                localStorage.removeItem("token");
                // navigate("/");
            }
        };

    fetchUser();

    }, [location.search, navigate]);

    useEffect(() => {
        // Загружаем избранных покемонов при каждом обновлении страницы
        pokemonStore.fetchUserFavorites();
    }, []);

    if (!user) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <h1>Профиль</h1>
            <p>Имя: {user.name}</p>
            <p>Email: {user.email}</p>
            <h2>Избранные покемоны</h2>
            <FavoriteList />
        </div>
    );
};

export default Profile;