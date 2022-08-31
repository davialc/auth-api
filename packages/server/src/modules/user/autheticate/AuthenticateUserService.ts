import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { prisma } from '../../../services/prisma';

interface IAuthenticateUser {
	username: string;
	password: string;
}

export class AuthenticateUserService {
	async execute({ username, password }: IAuthenticateUser) {
		const user = await prisma.user.findFirst({
			where: {
				username,
			},
		});
		if (!user) {
			throw new Error("User doesn't exists.");
		}

		const passwordMatch = await compare(password, user.password);
		if (!passwordMatch) {
			throw new Error('Username or password invalid.');
		}

		const token = sign({ username }, '827ccb0eea8a706c4c34a16891f84e7b', {
			subject: user.id,
			expiresIn: '1d',
		});
		
		// @ts-expect-error
		delete user.password;

		return {token, user};
	}
}
