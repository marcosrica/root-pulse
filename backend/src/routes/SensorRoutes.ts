import { Router } from 'express';
import { changeThresholds, changeWateringPeriod, changeWateringTime, getLastMeasure, getMeasures, getMeasuresInTimeFrame, getSensorInfo, TestSensorConnection } from '../ controllers/sensorControllers';

const SensorRoutes = Router();

SensorRoutes.post('/info', getSensorInfo);
SensorRoutes.post('/wateringTime', changeWateringTime);
SensorRoutes.post('/wateringPeriod', changeWateringPeriod);
SensorRoutes.post('/thresholds', changeThresholds);
SensorRoutes.post('/health', TestSensorConnection);
SensorRoutes.post('/getMeasures', getMeasures);
SensorRoutes.post('/getMeasuresInTimeFrame', getMeasuresInTimeFrame);
SensorRoutes.post('/lastMeasure', getLastMeasure);

export default SensorRoutes;