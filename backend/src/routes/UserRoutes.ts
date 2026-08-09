import { Router } from 'express';
import { addSensor, changeAlias, deleteSensor, getConnectedSensors, getUserInfo, setLanguage, setTheme } from '../ controllers/userControllers';
import changeUsername from '../ controllers/userControllers/ChangeUsername';

const UserRoutes = Router();

UserRoutes.post('/addSensor', addSensor);
UserRoutes.get('/getConnectedSensors', getConnectedSensors);
UserRoutes.delete('/deleteSensor', deleteSensor);
UserRoutes.post('/changeAlias', changeAlias);
UserRoutes.get('/info', getUserInfo);
UserRoutes.post('/theme', setTheme);
UserRoutes.post('/language', setLanguage);
UserRoutes.post('/username', changeUsername);

export default UserRoutes;