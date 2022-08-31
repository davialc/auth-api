import type { GetServerSideProps, NextPage } from 'next';
import { PersonIcon, ComponentInstanceIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../providers/authProvider';
import { parseCookies } from 'nookies';

interface IRequestErrors {
	request: {
		message: string;
	};
}

const Home: NextPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [isSubmiting, setIsSubmiting] = React.useState(false);
	const [requestErrors, setRequestErrors] = React.useState<string>();
	const { login } = useAuth();

	async function handleLogin(data: any) {
		if (Object.keys(errors).length !== 0) {
			return;
		}
		try {
			setIsSubmiting(true);
			const { username, password } = data;
			await login({ username, password });
		} catch (error: any) {
			setIsSubmiting(false);
			setRequestErrors(error.response.data.message);
		}
	}

	return (
		<div className="w-full h-screen flex justify-center items-center flex-col">
			<div className="flex flex-col min-w-[270px] w-[18%] gap-8">
				<div className="flex items-end gap-2">
					<h1 className="flex items-center gap-2 text-2xl font-semibold self-start select-none">
						<PersonIcon width={20} height={20} />
						User Auth.
					</h1>
					<Link href="/signin">
						<a className="text-blue-500 underline hover:text-blue-600 transition-colors">
							Create account
						</a>
					</Link>
				</div>
				<form
					onSubmit={handleSubmit(handleLogin)}
					className="flex flex-col gap-4 relative"
				>
					<label
						htmlFor=""
						className="w-full flex justify-between items-center"
					>
						Username
						<input
							{...register('username', { required: true })}
							autoComplete="false"
							type="text"
							className="bg-slate-50 rounded-md p-1 border-slate-400 border focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1 disabled:bg-slate-200 disabled:text-gray-600"
							disabled={isSubmiting}
						/>
					</label>
					<label
						htmlFor=""
						className="w-full flex justify-between items-center"
					>
						Password
						<input
							{...register('password', { required: true, minLength: 4 })}
							type="password"
							className="bg-slate-50 rounded-md p-1 border-slate-400 border focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1 disabled:bg-slate-200 disabled:text-gray-600"
							disabled={isSubmiting}
						/>
					</label>
					<button
						type="submit"
						className="py-1 px-5 bg-blue-500 rounded-md text-white hover:bg-blue-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1 w-[80px] h-[32px] flex justify-center items-center disabled:bg-blue-900"
						disabled={isSubmiting}
					>
						{isSubmiting ? (
							<ComponentInstanceIcon
								className="animate-spin"
								width={20}
								height={20}
							/>
						) : (
							'Login'
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

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { ['user-api.token']: token } = parseCookies(ctx);
	if (token) {
		return {
			redirect: {
				destination: '/home',
				permanent: false,
			},
		};
	}
	return {
		props: {},
	};
};
