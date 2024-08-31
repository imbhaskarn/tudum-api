import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(req.headers['set-cookie']);
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    console.log(token);
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        console.log(err.name);
        return res
          .status(403)
          .json({ message: 'Failed to authenticate token' });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.log((error as Error).message);
  }
};
