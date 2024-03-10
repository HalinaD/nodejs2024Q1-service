import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUser.dto';
import { UpdatePasswordDto } from '../dto/updatePassword.dto';
import { UserService } from './user.service';
import { validate } from 'uuid';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!validate(id)) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
      const { login, password } = createUserDto;
      if (!login || !password) {
          throw new HttpException('Login and password are required', HttpStatus.BAD_REQUEST);
      }
      return this.userService.create(createUserDto);
  }

  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
) {
    if (!validate(id)) {
        throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }
    if (!updatePasswordDto || !updatePasswordDto.oldPassword || !updatePasswordDto.newPassword) {
        throw new HttpException('Old password and new password are required', HttpStatus.BAD_REQUEST);
    }
    return this.userService.updatePassword(id, updatePasswordDto);
}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    if (!validate(id)) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }
    return this.userService.remove(id);
  }
}
