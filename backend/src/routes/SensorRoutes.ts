import { Router } from 'express';
import { changeWateringTime, getSensorInfo } from '../ controllers/sensorControllers';

const SensorRoutes = Router();

SensorRoutes.post('/info', getSensorInfo);
SensorRoutes.post('/wateringTime', changeWateringTime);

export default SensorRoutes;