import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
}

export class AuthService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m'
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
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

