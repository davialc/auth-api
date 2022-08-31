import { Request, Response } from 'express';
import { AuthenticateUserService } from './AuthenticateUserService';

export class AuthenticateUserController {
	async handle(request: Request, response: Response) {
		const { username, password } = request.body;
		const authenticateUserService = new AuthenticateUserService();
		try {
			const result = await authenticateUserService.execute({
				username,
				password,
			});
			return response.json(result);
		} catch (error) {
			return response.status(400).json({ message: error.message });
		}
	}
}
