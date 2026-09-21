//Imports
import express, {Application} from 'express';
import cors from 'cors';
import AuthRoutes from './routes/AuthRoutes';
import { authentication, errorHandler } from './middleware';
import cookieParser from 'cookie-parser';
import UserRoutes from './routes/UserRoutes';
import SensorRoutes from './routes/SensorRoutes';
import ControllerRoutes from './routes/ControllerRoutes';

//Creating the app
const app:Application = express();

//Middleware
app.use(cors({
    origin: 'http://localhost:5173', // your frontend origin (exact)
   credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//cookieParser before the rutes that uses cookies
app.use(cookieParser());

//authorization  routes / public routes, no authentication needed
app.use('/api/auth', AuthRoutes);

//Microcontroller routes work with a token embedded in the body, so no middleware needed
app.use('/api/controller', ControllerRoutes);

//Health check endpoint
app.get('/health', (req, res) => {
    res.json({status:'OK', timestamp: new Date().toISOString()});
});

//middleware with token authentication
app.use('/api', authentication)

//------------------
//private routes
//------------------
app.use('/api/user', UserRoutes);
app.use('/api/sensor', SensorRoutes);

//at the end to handle all the possible errors
app.use(errorHandler);



export default app;