import cors from 'cors';
import dotenv from 'dotenv';
import { timestamp } from 'drizzle-orm/mysql-core';
import express from 'express';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000']
  })
);
app.use((req, res, next) => {
  const currentTime = new Date().toISOString();
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(
    `[${currentTime}] ${req.method} ${req.originalUrl} - Client IP: ${clientIp}`
  );
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Welcome to Tudum API',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.use((req, res) => {
  return res.status(404).json({
    message: 'Resource not found',
    status: 'error',
    timestamp: new Date().toISOString()
  });
});

export default app;
