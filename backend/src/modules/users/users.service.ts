import bcrypt from 'bcryptjs';
import { db } from '../../db/index.js';
import { User, UserRole } from '../../types/index.js';
import { AppError } from '../../middleware/errorHandler.js';

export class UsersService {
  async findAll() {
    return db<User>('users')
      .select('id', 'email', 'name', 'role', 'created_at', 'updated_at')
      .orderBy('created_at', 'desc');
  }

  async findById(id: string) {
    const user = await db<User>('users')
      .where({ id })
      .select('id', 'email', 'name', 'role', 'created_at', 'updated_at')
      .first();

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async create(data: { email: string; password: string; name: string; role?: UserRole }) {
    const existing = await db<User>('users').where({ email: data.email }).first();

    if (existing) {
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
      .returning(['id', 'email', 'name', 'role', 'created_at', 'updated_at']);

    return user;
  }

  async update(id: string, data: { name?: string; email?: string; role?: UserRole }) {
    await this.findById(id);

    if (data.email) {
      const existing = await db<User>('users')
        .where({ email: data.email })
        .whereNot({ id })
        .first();

      if (existing) {
        throw new AppError('Email already exists', 400);
      }
    }

    const [user] = await db<User>('users')
      .where({ id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning(['id', 'email', 'name', 'role', 'created_at', 'updated_at']);

    return user;
  }

  async updatePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await db<User>('users').where({ id }).first();

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db<User>('users')
      .where({ id })
      .update({ password: hashedPassword, updated_at: db.fn.now() });

    return { success: true };
  }

  async delete(id: string) {
    await this.findById(id);
    await db<User>('users').where({ id }).delete();
    return { success: true };
  }
}

export const usersService = new UsersService();
