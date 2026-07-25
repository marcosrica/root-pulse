import { Router } from 'express';
//usando el archivo index.ts podemos importar la logica de los endpoints en una linea, para no hacer muchas lineas en un futuro
import { userLogin, createNewAccount } from '../user';

const UserRoutes = Router();

UserRoutes.post('/login', userLogin);
UserRoutes.post('/newAccount', createNewAccount);

export default UserRoutes;