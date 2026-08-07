import { Router } from 'express';
import { addSensor } from '../ controllers/userControllers';

const UserRoutes = Router();

UserRoutes.post('/addSensor', addSensor);

export default UserRoutes;