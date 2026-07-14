//Imports
import express, {Application} from 'express';
import cors from 'cors';
import UserRoutes from './routes/UserRoutes';

//Creating the app
const app:Application = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Routes
app.use('/api/user', UserRoutes);

//Health check endpoint
app.get('/health', (req, res) => {
    res.json({status:'OK', timestamp: new Date().toISOString()});
});

export default app;