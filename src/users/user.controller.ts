import { Controller, Get, UseGuards, Param, Put, Body, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UsePipes(new ValidationPipe())
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return await this.usersService.update(id, updateUser);
  }
}
