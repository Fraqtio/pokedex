import { observer } from "mobx-react-lite";
import pokemonStore from "../stores/PokemonStore";

const FavoriteButton = observer(({ pokemonName }) => {
    return (
        <button
            onClick={() => pokemonStore.toggleFavorite(pokemonName)}
            style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: pokemonStore.favorites.has(pokemonName) ? "#ffd700" : "rgba(255, 255, 255, 0.8)",
                border: "none",
                cursor: "pointer",
                fontSize: "24px",
                padding: "5px",
                borderRadius: "50%",
            }}
        >
            {pokemonStore.favorites.has(pokemonName) ? "★" : "☆"}
        </button>
    );
});

export default FavoriteButton;