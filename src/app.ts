import dotenv from 'dotenv';
import express from 'express';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';

dotenv.config();

const app = express();
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


app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

export default app;
