import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../db/index.js';
import { config } from '../../config/index.js';
import { User, JwtPayload } from '../../types/index.js';
import { AppError } from '../../middleware/errorHandler.js';
import { LoginInput, RegisterInput } from './auth.schema.js';

export class AuthService {
  async login(data: LoginInput) {
    const user = await db<User>('users').where({ email: data.email }).first();

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const tokens = this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async register(data: RegisterInput) {
    const existingUser = await db<User>('users')
      .where({ email: data.email })
      .first();

    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const [user] = await db<User>('users')
      .insert({
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || 'user',
      })
      .returning(['id', 'email', 'name', 'role']);

    const tokens = this.generateTokens(user as User);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        config.jwt.refreshSecret
      ) as JwtPayload;

      const user = await db<User>('users').where({ id: decoded.userId }).first();

      if (!user) {
        throw new AppError('User not found', 401);
      }

      const tokens = this.generateTokens(user);

      return tokens;
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  private generateTokens(user: Pick<User, 'id' | 'email' | 'role'>) {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
