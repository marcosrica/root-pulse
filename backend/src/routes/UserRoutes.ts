import { Router } from 'express';
import userLogin from './user/Login';
import createNewAccount from './user/CreateAccount';

const UserRoutes = Router();

UserRoutes.post('/login', userLogin);
UserRoutes.get('/newAccount', createNewAccount);

export default UserRoutes;