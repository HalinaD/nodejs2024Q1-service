import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdatePasswordDto } from '../dto/updatePassword.dto';
import { UserDto } from '../dto/user.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.client.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.client.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { login, password } = createUserDto;
    if (!login || !password) {
      throw new BadRequestException('Login and password are required');
    }

    const createdUser = await this.prisma.client.user.create({
      data: { ...createUserDto, createdAt: new Date(), updatedAt: new Date() },
    });

    const createdAtTimestamp = createdUser.createdAt.getTime();
    const updatedAtTimestamp = createdUser.updatedAt.getTime();

    return {
      ...createdUser,
      createdAt: createdAtTimestamp,
      updatedAt: updatedAtTimestamp,
      password: undefined,
    };
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserDto> {
    const { oldPassword, newPassword } = updatePasswordDto;
    const user = await this.prisma.client.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== oldPassword) {
      throw new ForbiddenException('Invalid password');
    }
    const updatedUser = await this.prisma.client.user.update({
      where: { id },
      data: { password: newPassword },
    });
    return {
      ...updatedUser,
      password: undefined,
      version: user.version + 1,
      createdAt: updatedUser.createdAt.getTime(),
      updatedAt: updatedUser.updatedAt.getTime(),
    };
  }

  async remove(id: string): Promise<void> {
    const user = await this.prisma.client.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.client.user.delete({ where: { id } });
  }
}
