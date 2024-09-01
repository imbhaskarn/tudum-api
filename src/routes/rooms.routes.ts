import { compare, hash } from 'bcrypt';
import { Router, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import db from '../db';
import { isAuthenticated } from '../utils/authToken';

const roomRouter = Router();

roomRouter.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = await db.query.User.findFirst({
      columns: { id: true, email: true, name: true }
    });

    return res.status(200).json({
      success: true,
      message: 'All users',
      data: {
        user
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

export default roomRouter;
