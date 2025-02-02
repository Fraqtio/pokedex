import axios from 'axios';
import {POKE_API_URL} from '../constants/pokeAPI';

export const fetchPokemonList = async ({limit = 10, offset = 0}) => {
    try {
        const response = await axios.get(`${POKE_API_URL}?offset=${offset}&limit=${limit}`);
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

export const getPokemonMaxCount = async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon');
    return response.data.count;
};