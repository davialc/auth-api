import { Request, Response } from 'express';
import { UpdateUserPasswordService } from './UpdateUserPasswordService';

export class UpdateUserPasswordController {
	async handle(request: Request, response: Response) {
		const { password } = request.body;
		const { userId } = request;
		const updateUserPasswordService = new UpdateUserPasswordService();
		const user = await updateUserPasswordService.execute({
			password,
			userId,
		});
		return response.json(user);
	}
}
