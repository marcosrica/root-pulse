//Imports
import express, {Application} from 'express';
import cors from 'cors';
import AuthRoutes from './routes/AuthRoutes';
import { authentication, errorHandler } from './middleware';
import cookieParser from 'cookie-parser';
import UserRoutes from './routes/UserRoutes';

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

//at the end to handle all the possible errors
app.use(errorHandler);



export default app;