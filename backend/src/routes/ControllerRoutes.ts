import { Router } from 'express';
import { addMeasure, getStatus } from '../ controllers/controllerControllers';

const ControllerRoutes = Router();

ControllerRoutes.post('/status', getStatus);
ControllerRoutes.post('/measure', addMeasure);

export default ControllerRoutes;