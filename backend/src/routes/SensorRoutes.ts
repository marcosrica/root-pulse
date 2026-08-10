import { Router } from 'express';
import { getSensorInfo } from '../ controllers/sensorControllers';

const SensorRoutes = Router();

SensorRoutes.post('/info', getSensorInfo);

export default SensorRoutes;