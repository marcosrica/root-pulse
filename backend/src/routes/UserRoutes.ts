import { Router } from 'express';
import { addSensor } from '../ controllers/userControllers';

const UserRoutes = Router();

UserRoutes.get('/addSensor', addSensor);

export default UserRoutes;