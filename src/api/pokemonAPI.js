import axios from 'axios';
import {POKE_API_URL} from '../constants/pokeAPI';

export const fetchPokemonList = async ({limit = 10, offset = 0}) => {
    try {
        const response = await axios.get(`${POKE_API_URL}pokemon/?offset=${offset}&limit=${limit}`);
        return response.data.results; // Возвращаем только базовую информацию
    } catch (error) {
        console.error("Ошибка:", error);
        return [];
    }
};

export const fetchPokemonListByType = async (typeNumber) => {
    try {
        const response = await axios.get(`${POKE_API_URL}type/${typeNumber}`);
        console.log("Ответ API для типа:", typeNumber, response.data);
        return response.data.pokemon || [];
    } catch (error) {
        console.error("Ошибка загрузки покемонов по типу:", error);
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
    const response = await axios.get(`${POKE_API_URL}pokemon`);
    return response.data.count;
};