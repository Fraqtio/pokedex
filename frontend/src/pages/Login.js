import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import pokemonStore from "../stores/PokemonStore";
import {runInAction} from "mobx";

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogin = async () => {
            const queryParams = new URLSearchParams(location.search);
            const token = queryParams.get("token");

            if (token) {
                localStorage.setItem("token", token);
                pokemonStore.setAuthenticated(true); // Обновляем статус
                await pokemonStore.fetchUserFavorites(); // Дождаться загрузки избранных покемонов
                navigate("/profile", { replace: true });
            } else {
                const storedToken = localStorage.getItem("token");
                navigate(storedToken ? "/profile" : "/");
            }
        };

        handleLogin();
    }, [location.search, navigate]);

    return null; // Можно вернуть loader вместо null
};

export default Login;