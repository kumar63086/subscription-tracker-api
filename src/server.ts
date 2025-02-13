import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import connectToDatabase from "./database/db"
import { PORT } from './config/env';
import authRouter from './routes/auth.route';
import {ORIGIN} from './config/env';
const app = express();


app.use(cors({
    origin: ORIGIN,  // Allow all origins
    credentials: true  // Allow credentials
  }));
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);

app.get("/", ( req: Request, res: Response ) => {
  res.send('Welcome to the Subscription Tracker API!');
});

app.listen(PORT, () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);
    connectToDatabase();
});