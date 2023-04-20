import jwt from 'jsonwebtoken';

// Mock users
// TODO: Replace with a real users collection with hashed passwords
const users = [{ username: 'admin', password: process.env.MASTER_PASSWORD }];

export default class AuthController {
  static async login(username: string, password: string) {
    const user = users.find(
      (u) => u.username === username && u.password && u.password === password,
    );
    if (!user) {
      throw new Error('Invalid username or password');
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET || '', { expiresIn: '24h' });
    return token;
  }
}
