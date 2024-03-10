import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdatePasswordDto } from '../dto/updatePassword.dto';
import { UserDto } from '../dto/user.dto';
import { DbService } from '../../db/db.service';
import { v4 as uuidv4 } from 'uuid';
 

@Injectable()
export class UserService {
  constructor(private readonly dbService: DbService) {}

  async findAll(): Promise<Omit<UserDto, 'password'>[]> {
    return this.dbService.users.map(({ id, login, version, createdAt, updatedAt }) => ({
      id,
      login,
      version,
      createdAt,
      updatedAt,
    }));
  }

  async findOne(id: string): Promise<UserDto> {
    const user = this.dbService.users.find(u => u.id === id);
    if (!user) {
        throw new NotFoundException('User not found');
    }
    return { ...user, password: undefined };
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { login, password } = createUserDto;
    if (!login || !password) {
      throw new BadRequestException('Login and password are required');
    }
    const newUser: UserDto = {
      id: uuidv4(),
      login,
      password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.dbService.users.push(newUser);
    return { ...newUser, password: undefined };
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<UserDto> {
    const { oldPassword, newPassword } = updatePasswordDto;
    const user = this.dbService.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== oldPassword) {
      throw new ForbiddenException('Invalid password');
    }
    user.password = newPassword;
    user.version++;
    user.updatedAt = Date.now();
    return { ...user, password: undefined };
  }

  async remove(id: string): Promise<void> {
    const index = this.dbService.users.findIndex(u => u.id === id);
    if (index === -1) {
        throw new NotFoundException('User not found');
    }
    this.dbService.users.splice(index, 1);
  }
}
