import { prisma } from '../../../services/prisma';
import { hash } from 'bcrypt';

interface IUpdateUserPassword {
	password: string;
	userId: string;
}

export class UpdateUserPasswordService {
	async execute({ password, userId }: IUpdateUserPassword) {
		const hashPassword = await hash(password, 10);
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				password: hashPassword,
			},
		});
	}
}
