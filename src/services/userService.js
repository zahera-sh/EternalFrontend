import api from './api';
import axios from 'axios';


async function getAllProfile() {

    const response = await api.get("/user/dashboard");
    return response.data

}


export {
    getAllProfile,
}