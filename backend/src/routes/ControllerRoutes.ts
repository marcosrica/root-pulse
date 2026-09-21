import { Router } from 'express';
import { getStatus } from '../ controllers/controllerControllers';

const ControllerRoutes = Router();

ControllerRoutes.post('/status', getStatus);

export default ControllerRoutes;