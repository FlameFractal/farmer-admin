import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { IUser } from '../interfaces';

export default class AuthController {
  static async login(username: string, password: string) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('Invalid username or password');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new Error('Invalid username or password');
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET || '', { expiresIn: '24h' });
    return token;
  }

  static async createUser(user: Omit<IUser, 'id' | 'createdAt'>): Promise<IUser> {
    const existingUser = await User.findOne({ username: user.username });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({
      ...user,
      password: hashedPassword,
    });

    await newUser.save();
    return newUser;
  }
}
