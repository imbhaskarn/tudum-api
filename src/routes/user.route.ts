import { compare, hash } from 'bcrypt';
import { Router, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import db from '../db';
import { isAuthenticated } from '../utils/authToken';

const userRouter = Router();

userRouter.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = await db.query.User.findFirst({
      where: (table, { eq }) => eq(table.id, req.user.id),
      columns: { id: true, email: true, name: true }
    });

    return res.status(200).json({
      success: true,
      message: 'Authenticated user',
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

userRouter.post('/login', async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }

  const { email, password } = req.body;

  const user = await db.query.User.findFirst({
    where: (table, { eq }) => eq(table.email, email),
    columns: { id: true, email: true, password: true, name: true }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const isValid = await compare(password, user?.password || '');

  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      auth: {
        accessToken: JWT.sign(
          { id: user.id },
          process.env.JWT_SECRET as string,
          {
            expiresIn: '90d'
          }
        ),
        refreshToken: JWT.sign(
          { id: user.id },
          process.env.JWT_REFRESH_SECRET as string,
          {
            expiresIn: '7d'
          }
        )
      }
    }
  });
});

export default userRouter;
