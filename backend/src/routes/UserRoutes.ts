import { Router } from 'express';
import { addSensor, ChangeAlias, deleteSensor, getConnectedSensors } from '../ controllers/userControllers';

const UserRoutes = Router();

UserRoutes.post('/addSensor', addSensor);
UserRoutes.get('/getConnectedSensors', getConnectedSensors);
UserRoutes.delete('/deleteSensor', deleteSensor);
UserRoutes.post('/changeAlias', ChangeAlias);

export default UserRoutes;