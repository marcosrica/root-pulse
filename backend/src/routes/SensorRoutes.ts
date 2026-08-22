import { Router } from 'express';
import { changeWateringPeriod, changeWateringTime, getSensorInfo } from '../ controllers/sensorControllers';

const SensorRoutes = Router();

SensorRoutes.post('/info', getSensorInfo);
SensorRoutes.post('/wateringTime', changeWateringTime);
SensorRoutes.post('/wateringPeriod', changeWateringPeriod);

export default SensorRoutes;