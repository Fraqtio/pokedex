import React from "react";
import { useNavigate } from "react-router-dom";
import pokemonStore from "../stores/PokemonStore";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        pokemonStore.setAuthenticated(false); // Обновляем статус
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <button onClick={handleLogout} style={styles.button}>
            Logout
        </button>
    );
};

const styles = {
    button: {
        padding: "10px 20px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
};

export default LogoutButton;