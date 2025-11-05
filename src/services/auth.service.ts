import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
}

export class AuthService {
  generateAccessToken(payload: TokenPayload): string {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }
    return jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m'
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }
    return jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }
    return jwt.verify(token, secret) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }
    return jwt.verify(token, secret) as TokenPayload;
  }

  async hashPassword(password: string): Promise<string> {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    return bcrypt.hash(password, rounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export default new AuthService();

