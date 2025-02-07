import React, { useEffect, useState } from "react";
import PokemonList from "../components/PokemonList";
import LogoutButton from "../components/LogoutButton";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Home = () => {

    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        const handleStorageChange = () => {
            const tokenFromStorage = localStorage.getItem("token");
            setToken(tokenFromStorage);
        };
        window.addEventListener("storage", handleStorageChange);


        return () => window.removeEventListener("storage", handleStorageChange);
    }, [token]); // Депенденси добавляем для отслеживания изменения токена

    return (
        <div>
            {token ? <LogoutButton /> : <GoogleLoginButton />}
            <PokemonList />
        </div>
    );
};

export default Home;