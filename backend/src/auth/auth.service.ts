import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Request } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      throw error;
    }
  }

  async login(
    {
      password,
      username,
    }: {
      password: string;
      username: string;
    },
    response: Response,
  ): Promise<User> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new BadRequestException('Invalid login or email');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid password');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true });

    return user;
  }

  async getProfile(request: Request): Promise<User | null> {
    try {
      const cookie = request.cookies['jwt'] as string | undefined;
      const data: { id: number } = await this.jwtService.verifyAsync(
        cookie ?? '',
      );

      if (!data) {
        throw new UnauthorizedException();
      }

      const user = await this.usersService.findOne(data['id']);

      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
