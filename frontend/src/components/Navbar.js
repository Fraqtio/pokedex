import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import GoogleLoginButton from "./GoogleLoginButton";

const Navbar = () => {

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
        <nav style={styles.nav}>
            <Link to="/" style={styles.link}>Главная</Link>
            <Link to="/profile" style={styles.link}>Профиль</Link>
            {token ? <LogoutButton /> : <GoogleLoginButton />}
        </nav>
    );
};

const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-around",
        padding: "10px",
        backgroundColor: "#f8f8f8",
        borderBottom: "1px solid #ddd",
    },
    link: {
        textDecoration: "none",
        color: "#333",
        fontSize: "18px",
    },
};

export default Navbar;