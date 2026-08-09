import api from './api';
import axios from 'axios';


async function createItem(body){
    const response = await api.post("/items", body);
    return response.data
}


export {
    createItem,
}