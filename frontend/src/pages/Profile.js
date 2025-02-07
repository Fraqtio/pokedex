import React, { useEffect, useState } from "react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";

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

                const userData = {
                    ...response.data,
                    favorites: response.data.favorites || [] // Если favorites нет - используем пустой массив
                };
                console.log(userData);
                setUser(userData);

            } catch (err) {
                console.error("Ошибка загрузки данных:", err);
                localStorage.removeItem("token");
                // navigate("/");
            }
        };

    fetchUser();

    }, [location.search, navigate]);

    if (!user) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <h1>Профиль</h1>
            <p>Имя: {user.displayName}</p>
            <p>Email: {user.email}</p>
            <h2>Избранные покемоны</h2>
            <ul>
                {user.favorites.map((pokemon) => (
                    <li key={pokemon._id}>{pokemon.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Profile;