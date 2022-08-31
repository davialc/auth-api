import React from 'react';
import { api } from '../services/api';
import { parseCookies, setCookie } from 'nookies';
import Router from 'next/router';

interface IAuthContext {
	isAuthenticated: boolean;
	login: (data: AuthData) => Promise<void>;
	user: IUser | undefined;
	setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}

export interface AuthData {
	username: string;
	password: string;
}

export interface IUser {
	username: string;
	id: string;
}

const AuthContext = React.createContext({} as IAuthContext);

export const AuthProvider = ({ children }: any) => {
	const [user, setUser] = React.useState<IUser>();
	const isAuthenticated = !!user;

	React.useEffect(() => {
		const { 'user-api.token': token } = parseCookies();
		if (token) {
			handleRecoverUser(token);
		}
	}, []);

	async function handleRecoverUser(token: string) {
		const response = await api.post('/user/recover', '', {
			headers: { Authorization: `Bearer ${token}` },
		});
		const user = response.data;
		setUser(user);
	}

	async function login({ username, password }: AuthData) {
		const response = await api.post('/user/authenticate', {
			username,
			password,
		});
		const { token, user } = response.data;
		setCookie(undefined, 'user-api.token', token, { maxAge: 60 * 60 * 1 });
		//@ts-expect-error
		api.defaults.headers['Authorization'] = `Bearer ${token}`;
		setUser(user);
		Router.push('/home');
	}

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const { isAuthenticated, login, user, setUser } =
		React.useContext(AuthContext);
	return {
		isAuthenticated,
		login,
		user,
		setUser,
	};
};
