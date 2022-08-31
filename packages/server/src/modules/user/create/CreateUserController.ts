import { Request, Response } from 'express';
import { CreateUserService } from './CreateUserService';

export class CreateUserController {
	async handle(request: Request, response: Response) {
		const { username, password } = request.body;
		const createUserService = new CreateUserService();
		const user = await createUserService.execute({
			username,
			password,
		});
		return response.json(user);
	}
}
