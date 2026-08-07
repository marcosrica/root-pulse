import { Router } from 'express';
import { addSensor, deleteSensor, getConnectedSensors } from '../ controllers/userControllers';

const UserRoutes = Router();

UserRoutes.post('/addSensor', addSensor);
UserRoutes.get('/getConnectedSensors', getConnectedSensors);
UserRoutes.delete('/deleteSensor', deleteSensor);

export default UserRoutes;