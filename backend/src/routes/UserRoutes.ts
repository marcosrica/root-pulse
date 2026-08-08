import { Router } from 'express';
import { addSensor, changeAlias, deleteSensor, getConnectedSensors, getUserInfo } from '../ controllers/userControllers';

const UserRoutes = Router();

UserRoutes.post('/addSensor', addSensor);
UserRoutes.get('/getConnectedSensors', getConnectedSensors);
UserRoutes.delete('/deleteSensor', deleteSensor);
UserRoutes.post('/changeAlias', changeAlias);
UserRoutes.get('/info', getUserInfo);

export default UserRoutes;