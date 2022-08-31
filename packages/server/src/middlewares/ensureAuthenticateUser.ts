import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export async function ensureAuthenticateUser(
	request: Request,
	response: Response,
	next: NextFunction
) {
	const authHeader = request.headers.authorization;
	if (!authHeader) {
		throw new Error('Token is missing.');
	}

	const token = authHeader.split(' ')[1];

	try {
		const { sub } = verify(token, '827ccb0eea8a706c4c34a16891f84e7b');
		request.userId = sub as string;
		return next();
	} catch (error) {
		throw new Error('Invalid token.')
	}
}
