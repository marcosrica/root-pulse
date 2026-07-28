//Imports
import express, {Application} from 'express';
import cors from 'cors';
import AuthRoutes from './routes/AuthRoutes';
import authentication from './middleware/authentication';
import cookieParser from 'cookie-parser';

//Creating the app
const app:Application = express();

//Middleware
app.use(cors());
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



export default app;