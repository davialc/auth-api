import type { GetServerSideProps, NextPage } from 'next';
import {
	ComponentInstanceIcon,
	Pencil1Icon,
	PersonIcon,
} from '@radix-ui/react-icons';
import React, { useRef } from 'react';
import { IUser, useAuth } from '../../providers/authProvider';
import { parseCookies, destroyCookie } from 'nookies';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';

const Homepage: NextPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const { user, setUser } = useAuth();
	const [isSubmiting, setIsSubmiting] = React.useState(false);
	const [requestErrors, setRequestErrors] = React.useState<string>();
	const [editUsername, setEditUsername] = React.useState(false);
	const [editPassword, setEditPassword] = React.useState(false);
	async function handleEditUsername() {
		setEditUsername(true);
	}
	async function handleEditPassword() {
		setEditPassword(true);
	}
	async function handleLogin(data: any) {
		if (Object.keys(errors).length !== 0) {
			return;
		}
		const { username, password } = data;
		if (!password) {
			try {
				setIsSubmiting(true);
				const response = await api.put('/user/update/username', { username });
				if (response.status === 200) {
					setIsSubmiting(false);
					setEditUsername(false);
					setUser({ ...user, username } as IUser);
				}
				return;
			} catch (error: any) {
				setIsSubmiting(false);
				setRequestErrors(error.response.data.message);
				return;
			}
		}
		if (!username) {
			try {
				setIsSubmiting(true);
				const response = await api.put('/user/update/password', { password });
				if (response.status === 200) {
					setIsSubmiting(false);
					setEditPassword(false);
				}
				return;
			} catch (error: any) {
				setIsSubmiting(false);
				setRequestErrors(error.response.data.message);
				return;
			}
		}
		try {
			setIsSubmiting(true);
			const usernameResponse = await api.put('/user/update/username', {
				username,
			});
			const passwordResponse = await api.put('/user/update/password', {
				password,
			});
			if (usernameResponse.status === 200) {
				setIsSubmiting(false);
				setEditUsername(false);
				setUser({ ...user, username } as IUser);
			}
			if (passwordResponse.status === 200) {
				setIsSubmiting(false);
				setEditPassword(false);
			}
			return;
		} catch (error: any) {
			setIsSubmiting(false);
			setRequestErrors(error.response.data.message);
			return;
		}
	}
	return (
		<div className="w-full h-screen flex justify-center items-center flex-col">
			<div className="flex flex-col min-w-[270px] w-[18%] gap-8">
				<div className="flex items-end gap-2">
					<h1 className="flex items-center gap-2 text-2xl font-semibold self-start select-none">
						<PersonIcon width={20} height={20} />
						Hello {user?.username}!
					</h1>
					<Link href="/">
						<a
							className="text-blue-500 underline hover:text-blue-600 transition-colors"
							onClick={() => destroyCookie(undefined, 'user-api.token')}
						>
							Sign out
						</a>
					</Link>
				</div>
				<form
					onSubmit={handleSubmit(handleLogin)}
					className="flex flex-col gap-4 relative"
				>
					<label
						htmlFor=""
						className="w-full flex justify-between items-center relative"
					>
						Username
						<input
							{...register('username')}
							autoComplete="false"
							type="text"
							defaultValue={user?.username}
							className="bg-slate-50 rounded-md p-1 border-slate-400 border focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1 disabled:bg-slate-200 disabled:text-gray-600"
							disabled={!editUsername}
						/>
						{!editUsername && (
							<button
								className="absolute right-0 mr-2 hover:scale-125 transition-all"
								onClick={handleEditUsername}
								type="button"
							>
								<Pencil1Icon />
							</button>
						)}
					</label>
					<label
						htmlFor=""
						className="w-full flex justify-between items-center"
					>
						Password
						<input
							{...register('password', { minLength: 4 })}
							type="password"
							className="bg-slate-50 rounded-md p-1 border-slate-400 border focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1 disabled:bg-slate-200 disabled:text-gray-600"
							disabled={!editPassword}
						/>
						{!editPassword && (
							<button
								className="absolute right-0 mr-2 hover:scale-125 transition-all"
								onClick={handleEditPassword}
								type="button"
							>
								<Pencil1Icon />
							</button>
						)}
					</label>

					<button
						type="submit"
						className={`py-1 px-5 bg-blue-500 rounded-md text-white hover:bg-blue-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1 w-[80px] h-[32px] flex justify-center items-center disabled:bg-blue-900 ${
							!editPassword && !editUsername && 'invisible'
						}`}
					>
						{isSubmiting ? (
							<ComponentInstanceIcon
								className="animate-spin"
								width={20}
								height={20}
							/>
						) : (
							'Update'
						)}
					</button>
					<p className="text-sm text-red-500 absolute -bottom-20">
						{errors.username && (
							<>
								Username is required
								<br />
							</>
						)}

						{errors.password?.type === 'minLength' && (
							<>
								The password must contain at least 4 characters
								<br />
							</>
						)}
						{errors.password?.type === 'required' && 'Password is required'}
						{requestErrors}
					</p>
				</form>
			</div>
		</div>
	);
};

export default Homepage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { ['user-api.token']: token } = parseCookies(ctx);
	if (!token) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
	return {
		props: {},
	};
};
