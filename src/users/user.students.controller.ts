import { Controller, Get, UseGuards, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { StudentGuard } from 'src/guards/student.guard';

@Controller('users/students')
export class UserStudentsController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createStudent: CreateUserDto) {
    return await this.usersService.create(createStudent);
  }

  @UseGuards(AuthGuard('jwt'), StudentGuard)
  @Get('classes-student/:id')
  async findClassesStudent(@Param('id') id: string) {
    return await this.usersService.findClassesStudent(id);
  }

  @UseGuards(AuthGuard('jwt'), StudentGuard)
  @Put(':id')
  async updateStudent(@Param('id') id: string, @Body() updateStudent: CreateUserDto) {
    return await this.usersService.update(id, updateStudent);
  }

  @UseGuards(AuthGuard('jwt'), StudentGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }
}
