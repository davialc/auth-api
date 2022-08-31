import type { NextPage } from 'next';
import { PersonIcon, ComponentInstanceIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import React from 'react';
import Link from 'next/link';

const SignIn: NextPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [isSubmiting, setIsSubmiting] = React.useState(false);

	function handleLogin(data: any) {
		if (Object.keys(errors).length !== 0) {
			return;
		}
		setIsSubmiting(true);
		console.log(data);
	}

	return (
		<div className="w-full h-screen flex justify-center items-center flex-col">
			<div className="flex flex-col w-[18%] gap-8">
				<div className="flex items-end gap-2">
					<h1 className="flex items-center gap-2 text-2xl font-semibold self-start select-none">
						<PersonIcon width={20} height={20} />
						User Auth.
					</h1>
					<Link href="/">
						<a className="text-indigo-500 underline hover:text-indigo-600 transition-colors">
							Login
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
							className="bg-slate-50 rounded-md p-1 border-slate-400 border focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-1 disabled:bg-slate-200 disabled:text-gray-600"
							disabled={isSubmiting}
						/>
					</label>
					<label
						htmlFor=""
						className="w-full flex justify-between items-center"
					>
						Password
						<input
							{...register('password', { required: true, minLength: 6 })}
							type="password"
							className="bg-slate-50 rounded-md p-1 border-slate-400 border focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-1 disabled:bg-slate-200 disabled:text-gray-600"
							disabled={isSubmiting}
						/>
					</label>
					<button
						type="submit"
						className="py-1 px-5 bg-indigo-500 rounded-md text-white hover:bg-indigo-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-1 w-[89px] h-[32px] flex justify-center items-center disabled:bg-indigo-900"
						disabled={isSubmiting}
					>
						{isSubmiting ? (
							<ComponentInstanceIcon
								className="animate-spin"
								width={20}
								height={20}
							/>
						) : (
							'Sign in'
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
								The password must contain at least 6 characters
								<br />
							</>
						)}
						{errors.password?.type === 'required' && 'Password is required'}
					</p>
				</form>
			</div>
		</div>
	);
};

export default SignIn;
