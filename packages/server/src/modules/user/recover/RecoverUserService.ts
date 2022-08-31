import { prisma } from '../../../services/prisma';

export class RecoverUserService {
	async execute(userId: string) {
		const user = await prisma.user.findFirst({
			where: {
				id: userId,
			},
		});
		// @ts-expect-error
		delete user?.password;
		return user;
	}
}
