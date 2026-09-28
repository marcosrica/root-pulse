import { Router } from 'express';
import { changeThresholds, changeWateringPeriod, changeWateringTime, getMeasures, getSensorInfo, TestSensorConnection } from '../ controllers/sensorControllers';

const SensorRoutes = Router();

SensorRoutes.post('/info', getSensorInfo);
SensorRoutes.post('/wateringTime', changeWateringTime);
SensorRoutes.post('/wateringPeriod', changeWateringPeriod);
SensorRoutes.post('/thresholds', changeThresholds);
SensorRoutes.post('/health', TestSensorConnection);
SensorRoutes.post('/getMeasures', getMeasures);

export default SensorRoutes;