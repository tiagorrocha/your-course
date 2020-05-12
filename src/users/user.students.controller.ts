import {
  Controller, Get, UseGuards, Param,
  Post, Body, Put, Delete, UsePipes
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { StudentGuard } from '../guards/student.guard';
import { RegisterStudentCourseDto } from './dto/register-student-course.user.dto';
import { User } from '../utils/user.decorator';
import { ValidationPipe } from '../pipes/validation.pipe';

@Controller('users/students')
export class UserStudentsController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createStudent: CreateUserDto) {
    return await this.usersService.create(createStudent);
  }

  @UseGuards(AuthGuard('jwt'), StudentGuard)
  @Get('student-courses/:id')
  async findClassesStudent(@Param('id') id: string) {
    return await this.usersService.findStudentCourses(id);
  }

  @UseGuards(AuthGuard('jwt'), StudentGuard)
  @UsePipes(new ValidationPipe())
  @Put(':id')
  async updateStudent(@Param('id') id: string,
    @Body() updateStudent: CreateUserDto) {
    return await this.usersService.update(id, updateStudent);
  }

  @UseGuards(AuthGuard('jwt'), StudentGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }

  @UseGuards(AuthGuard('jwt'), StudentGuard)
  @UsePipes(new ValidationPipe())
  @Post('register-student-course')
  async RegisterStudentClass(@User() user: any,
    @Body() registerStudentCourse: RegisterStudentCourseDto) {
    return await this.usersService
      .registerStudentCourse(user._id, registerStudentCourse);
  }
}
