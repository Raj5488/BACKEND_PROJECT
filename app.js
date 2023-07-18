import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
import {config} from 'dotenv';
import morgan from 'morgan';
import userRouters from './Routs/user.routes.js'
import { errorMonitor } from 'nodemailer/lib/xoauth2/index.js';
import errorMiddleware from './MiddleWares/error.middlewares.js';
// config();

app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));

app.use(cookieParser());
app.use(morgan('dev'))

app.use('/ping', function(req, res){
    res.send('Hello!! Welcome')
});

app.use('/api/v1/user', userRoutes)

app.all('*', (req,res)=>{
    res.status(404).send('OOPS!! 404 page not found');
});

app.use(errorMiddleware);
export default app;


