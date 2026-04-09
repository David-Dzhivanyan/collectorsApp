import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = this.userRepo.create({
        ...userData,
        password: hashedPassword,
      });
      return await this.userRepo.save(user);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        throw new ConflictException(
          'Пользователь с таким логином или email уже существует',
        );
      }

      throw error;
    }
  }

  async findOneByUsername(username: string): Promise<User | null> {
    if (!username) {
      return null;
    }

    // return this.userRepo.findOne({ where: { username }, select: ['password'] });
    return this.userRepo.findOne({ where: { username } });
  }

  async getAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepo.find();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ password, ...user }) => user);
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepo.findOneBy({ id });
  }

  async search(q: string): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepo
      .createQueryBuilder('user')
      .where(
        'LOWER(user.username) LIKE :q OR LOWER(user."firstName") LIKE :q OR LOWER(user."lastName") LIKE :q',
        { q: `%${q.toLowerCase()}%` },
      )
      .take(20)
      .getMany()
    return users.map(({ password, ...u }) => u)
  }

  async uploadAvatar(userId: number, filename: string): Promise<User> {
    await this.userRepo.update(userId, { avatar: filename });
    return this.userRepo.findOneBy({ id: userId }) as Promise<User>;
  }

  async deleteAvatar(userId: number): Promise<void> {
    await this.userRepo.update(userId, { avatar: undefined });
  }
}
