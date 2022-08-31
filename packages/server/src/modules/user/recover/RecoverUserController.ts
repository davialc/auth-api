import { Request, Response } from 'express';
import { RecoverUserService } from './RecoverUserService';

export class RecoverUserController {
	async handle(request: Request, response: Response) {
		const userId = request.userId;
		const recoverUserService = new RecoverUserService();
		const result = await recoverUserService.execute(userId);
		response.json(result);
	}
}
