import { Router } from 'express';
import { changeThresholds, changeWateringPeriod, changeWateringTime, getSensorInfo, TestSensorConnection } from '../ controllers/sensorControllers';

const SensorRoutes = Router();

SensorRoutes.post('/info', getSensorInfo);
SensorRoutes.post('/wateringTime', changeWateringTime);
SensorRoutes.post('/wateringPeriod', changeWateringPeriod);
SensorRoutes.post('/thresholds', changeThresholds);
SensorRoutes.get('/health', TestSensorConnection);

export default SensorRoutes;