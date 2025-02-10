import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import GoogleLoginButton from "./GoogleLoginButton";
import { observer } from "mobx-react-lite";
import pokemonStore from "../stores/PokemonStore";

const Navbar = observer(() => {
    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.link}>Main</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
            {pokemonStore.authenticated ? <LogoutButton /> : <GoogleLoginButton />}
        </nav>
    );
});

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