import axios from 'axios';

const http = axios.create({
    baseURL: 'http://34.123.225.29:5005',
    // baseURL: '../../zipnews.postman_collection.json'
});

export {http};