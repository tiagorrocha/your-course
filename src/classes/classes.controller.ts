import { Controller, Get, Post, Body, UseGuards, Put, Param, Delete, UsePipes } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdateClassDto } from './dto/update-class.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';

@Controller('classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService) { }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @UsePipes(new ValidationPipe())
    @Post()
    async create(@Body() createClassDto: CreateClassDto) {
        return await this.classesService.create(createClassDto);
    }

    @Get()
    async findAll() {
        return await this.classesService.findAll();
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @UsePipes(new ValidationPipe())
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateClass: UpdateClassDto) {
        return await this.classesService.update(id, updateClass);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.classesService.delete(id);
    }
}
