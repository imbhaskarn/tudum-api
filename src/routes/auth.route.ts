import { compare, hash } from 'bcrypt';
import { Router } from 'express';
import JWT from 'jsonwebtoken';
import db from '../db';
import { User } from '../db/schema';

import { loginSchema, registrationSchema } from '../utils/joi/schema';

const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.message.replace(/"/g, '') });
    }
    const { email, password, name } = req.body;
    const existingUser = await db.query.User.findFirst({
      columns: { email: true, id: true },
      where: (table, { eq }) => eq(table.email, email)
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword = await hash(password, 10);

    const user = await db
      .insert(User)
      .values({
        email,
        password: hashedPassword,
        name,
        createdAt: new Date(),
        lastLogin: new Date(),
        updatedAt: new Date()
      })
      .returning({
        id: User.id,
        email: User.email,
        name: User.name
      });

    return res.status(201).json({
      success: true,
      message: 'User created',
      data: {
        user: user[0],
        auth: {
          accessToken: JWT.sign(
            { id: user[0].id },
            process.env.JWT_SECRET as string,
            {
              expiresIn: '15m'
            }
          ),
          refreshToken: JWT.sign(
            { id: user[0].id },
            process.env.JWT_REFRESH_SECRET as string,
            {
              expiresIn: '7d'
            }
          )
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.message.replace(/"/g, '') });
    }
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
            expiresIn: '15m'
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

authRouter.get('/refresh-token', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  JWT.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string,
    (err, decoded: any) => {
      if (err) {
        return res
          .status(403)
          .json({ message: 'Failed to authenticate token' });
      }
      const accessToken = JWT.sign(
        { id: decoded.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
      );
      return res.status(200).json({
        success: true,
        message: 'Token refreshed',
        data: {
          accessToken
        }
      });
    }
  );
});

export default authRouter;
