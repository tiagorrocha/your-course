import { Controller, Get, Post, Body, UseGuards, Res, HttpStatus, Request, Put, Delete, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/utils/user.decorator';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
  
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get()
  async findAll(@User() user : any){
    return await this.usersService.findAll();
  }
}
