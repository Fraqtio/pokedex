import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.link}>Главная</Link>
            <Link to="/profile" style={styles.link}>Профиль</Link>
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