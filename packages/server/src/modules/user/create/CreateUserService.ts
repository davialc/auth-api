import { hash } from 'bcrypt';
import { prisma } from '../../../services/prisma';

interface ICreateUser {
	username: string;
	password: string;
}

export class CreateUserService {
	async execute({ username, password }: ICreateUser) {
		const userExists = await prisma.user.findFirst({
			where: {
				username: {
					equals: username,
					mode: 'insensitive',
				},
			},
		});

		if (userExists) {
			throw new Error('User already exists.');
		}

		const hashPassword = await hash(password, 10);

		await prisma.user.create({
			data: {
				username,
				password: hashPassword,
			},
		});
	}
}
