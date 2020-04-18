import { Controller, Get, UseGuards, Param, Post, Body, Put, Delete, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { TeacherGuard } from 'src/guards/teacher.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';

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
  @Get('classes-teacher/:id')
  async findClasssesTeacher(@Param('id') id: string) {
    return await this.usersService.findClassesTeacher(id);
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
