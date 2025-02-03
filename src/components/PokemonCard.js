import React from "react";
import {getTypeColor} from "../constants/pokeTypes";

const PokemonCard = ({ name, image, types, stats }) => {
    return (
        <div style={styles.card}>
            <img src={image} alt={name} style={styles.image} />
            <h3 style={styles.name}>{name}</h3>
            <div style={styles.typesContainer}>
                {types.map((type) => (
                    <span key={type} style={{ ...styles.typeTag, backgroundColor: getTypeColor(type) }}>
                        {type}
                    </span>
                ))}
            </div>
            <div style={styles.stats}>
                <p>HP: {stats.hp}</p>
                <p>Defense: {stats.defense}</p>
                <p>Speed: {stats.speed}</p>
            </div>
        </div>
    );
};

const styles = {
    card: {
        border: "4px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        width: "200px",
        textAlign: "center",
        backgroundColor: "#f8f8f8",
        boxShadow: "3px 3px 10px rgba(0,0,0,0.1)",
    },
    image: {
        width: "100px",
        height: "100px",
    },
    name: {
        textTransform: "capitalize",
    },
    typesContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "5px",
        marginBottom: "10px",
    },
    typeTag: {
        padding: "5px 10px",
        borderRadius: "5px",
        color: "white",
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: "12px",
    },
    stats: {
        fontSize: "14px",
        lineHeight: "1.5",
    },
};

export default PokemonCard;