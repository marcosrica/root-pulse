import { Router } from 'express';
//usando el archivo index.ts podemos importar la logica de los endpoints en una linea, para no hacer muchas lineas en un futuro
import { userLogin, createNewAccount, sensorLogin } from '../ controllers/authControllers';

const AuthRoutes = Router();

AuthRoutes.post('/login', userLogin);
AuthRoutes.post('/newAccount', createNewAccount);
AuthRoutes.post('/sensor', sensorLogin);

export default AuthRoutes;