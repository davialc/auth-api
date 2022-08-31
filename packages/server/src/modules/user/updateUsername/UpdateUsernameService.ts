import { prisma } from '../../../services/prisma';

interface IUpdateUsername {
	username: string;
	userId: string;
}

export class UpdateUsernameService {
	async execute({ username, userId }: IUpdateUsername) {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				username,
			},
		});
	}
}
