import { Controller, Get, Post, Body, UseGuards, Put, Param, Delete } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService){}

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Post()
    async create(@Body() createClassDto: CreateClassDto){
        return await this.classesService.create(createClassDto);
    }

    @Get()
    async findAll(){
        return await this.classesService.findAll();
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateClass: CreateClassDto){
        return await this.classesService.update(id, updateClass);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Delete(':id')
    async delete(@Param('id') id: string){
        return await this.classesService.delete(id);
    }
}
