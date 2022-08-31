import { Request, Response, Router } from 'express';
import { CreateUserController } from './modules/user/create/CreateUserController';
import { UpdateUsernameController } from './modules/user/updateUsername/UpdateUsernameController';
import { UpdateUserPasswordController } from './modules/user/updatePassword/UpdateUserPasswordController';
import { AuthenticateUserController } from './modules/user/autheticate/AuthenticateUserController';
import { ensureAuthenticateUser } from './middlewares/ensureAuthenticateUser';
import { RecoverUserController } from './modules/user/recover/RecoverUserController';

export const routes = Router();

routes.get('/', (request: Request, response: Response) =>
	response.status(200).send('ok')
);

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();
const updateUsernameController = new UpdateUsernameController();
const updateUserPasswordController = new UpdateUserPasswordController();
const recoverUserController = new RecoverUserController();

routes.post('/user/create', createUserController.handle);
routes.post('/user/authenticate', authenticateUserController.handle);
routes.put(
	'/user/update/username',
	ensureAuthenticateUser,
	updateUsernameController.handle
);
routes.put(
	'/user/update/password',
	ensureAuthenticateUser,
	updateUserPasswordController.handle
);
routes.post(
	'/user/recover',
	ensureAuthenticateUser,
	recoverUserController.handle
);
