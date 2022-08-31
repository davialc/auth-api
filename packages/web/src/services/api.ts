import axios from 'axios';
import { parseCookies } from 'nookies';

const { 'user-api.token': token } = parseCookies();

export const api = axios.create({
	baseURL: 'http://localhost:3333',
});

if (token) {
	//@ts-expect-error
	api.defaults.headers['Authorization'] = `Bearer ${token}`;
}
