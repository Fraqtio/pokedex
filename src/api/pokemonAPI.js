import axios from 'axios';

export const fetchPokemonList = async (limit = 10, offset = 0) => {
    try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon', { params: { limit, offset } });
        return response.data.results; // Возвращаем только базовую информацию
    } catch (error) {
        console.error("Ошибка:", error);
        return [];
    }
};

export const fetchPokemonDetails = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Ошибка загрузки данных о покемоне:", error);
        return [];
    }
};

export const getPokemonCount = async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
    return response.data.count;
};