import api from './api';
import axios from 'axios';


async function createItem(body) {
    const response = await api.post("/items", body);
    return response.data
}

async function getAllItems() {
    const response = await api.get("/items");
    return response.data
}

async function getItemById(itemId) {
    const response = await api.get(`/items/${itemId}`);
    return response.data
}


export {
    createItem,
    getAllItems,
    getItemById,
}