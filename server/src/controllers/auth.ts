import jwt from 'jsonwebtoken';

const users = [{ username: 'admin', password: 'password' }];

export default class AuthController {
  static async login(username: string, password: string) {
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET || '', { expiresIn: '24h' });
    return token;
  }
}
