import {
  Controller, Get, UseGuards, Param, Post, Body,
  Put, Delete, UsePipes
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../guards/admin.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { TeacherGuard } from '../guards/teacher.guard';
import { ValidationPipe } from '../pipes/validation.pipe';

@Controller('users/teachers')
export class UserTeachersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('teacher-courses/:id')
  async findTeacherCourses(@Param('id') id: string) {
    return await this.usersService.findTeacherCourses(id);
  }

  @UseGuards(AuthGuard('jwt'), TeacherGuard)
  @UsePipes(new ValidationPipe())
  @Put(':id')
  async update(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    return await this.usersService.update(id, createUserDto);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }
}
