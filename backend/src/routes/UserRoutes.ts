import { Router } from 'express';
import { addSensor, getConnectedSensors } from '../ controllers/userControllers';

const UserRoutes = Router();

UserRoutes.post('/addSensor', addSensor);
UserRoutes.get('/getConnectedSensors', getConnectedSensors)

export default UserRoutes;