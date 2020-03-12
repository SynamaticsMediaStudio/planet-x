import axios from 'axios';
const instance = axios.create({
    baseURL:'http://planet.test/api/'
})
export default instance;