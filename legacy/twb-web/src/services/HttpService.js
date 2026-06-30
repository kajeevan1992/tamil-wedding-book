import * as authService from './AuthService';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export function http() {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: authService.getAccessToken()
                ? `Bearer ${authService.getAccessToken()}`
                : '',
        }
    });
}

export function httpFile() {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: authService.getAccessToken()
                ? `Bearer ${authService.getAccessToken()}`
                : '',
            'Content-Type': 'multipart/form-data'
        }
    });
}
