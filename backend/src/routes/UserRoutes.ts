import { Router } from 'express';
import { userLogin, createNewAccount } from './user';

const UserRoutes = Router();

UserRoutes.post('/login', userLogin);
UserRoutes.post('/newAccount', createNewAccount);

export default UserRoutes;