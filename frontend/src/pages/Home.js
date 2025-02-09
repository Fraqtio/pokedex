import React from "react";
import PokemonList from "../components/PokemonList";
import Initializer from "../components/Initializer";

const Home = () => {

    return (
        <div>
            <Initializer />
            <PokemonList />
        </div>
    );
};

export default Home;