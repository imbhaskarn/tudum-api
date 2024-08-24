import { compare, hash } from 'bcrypt';
import { Router } from 'express';
import db from '../db';
import { User } from '../db/schema';
import { registrationSchema } from '../utils/joi/schema';

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
    const existingUser = await db.query.User.findMany({
      columns: { email: true, id: true },
      where: (table, { eq }) => eq(table.email, email)
    });

    if (existingUser.length) {
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

    console.log(user);

    return res.status(201).json({
      success: true,
      message: 'User created',
      data: user
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

authRouter.post('/login', (req, res) => {
  res.send('Login route');
});

export default authRouter;
