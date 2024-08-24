import dotenv from 'dotenv';
import express from 'express';
import authRouter from './routes/auth.route';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRouter);

export default app;
