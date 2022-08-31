import { Request, Response } from 'express';
import { UpdateUsernameService } from './UpdateUsernameService';

export class UpdateUsernameController {
	async handle(request: Request, response: Response) {
		const { username } = request.body;
		const { userId } = request;
		const updateUsernameService = new UpdateUsernameService();
		const user = await updateUsernameService.execute({
			username,
			userId,
		});
		return response.json(user);
	}
}
