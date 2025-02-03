export const allTypes = [
    'normal', 'flying', 'water', 'fire', 'grass',
    'poison', 'bug', 'electric', 'ground', 'fairy',
    'fighting', 'psychic', 'rock', 'steel', 'ice',
    'ghost', 'dragon', 'dark', 'stellar', 'unknown'
];

export const typeColors = {
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

export const getTypeColor = (type) => {
    return typeColors[type] || "#A8A878"; // По умолчанию серый цвет
};