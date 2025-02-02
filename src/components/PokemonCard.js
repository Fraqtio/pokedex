import React from "react";

const getTypeColor = (type) => {
    const typeColors = {
        grass: "#78C850",
        poison: "#A040A0",
        fire: "#F08030",
        water: "#6890F0",
        electric: "#F8D030",
        ice: "#98D8D8",
        fighting: "#C03028",
        ground: "#E0C068",
        flying: "#A890F0",
        psychic: "#F85888",
        bug: "#A8B820",
        rock: "#B8A038",
        ghost: "#705898",
        dragon: "#7038F8",
        dark: "#705848",
        steel: "#B8B8D0",
        fairy: "#EE99AC",
        normal: "#A8A878",
    };
    return typeColors[type] || "#A8A878"; // По умолчанию серый цвет
};

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