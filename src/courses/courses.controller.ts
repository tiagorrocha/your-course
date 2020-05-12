import {
    Controller, Get, Post, Body, UseGuards, Put, Param,
    Delete, UsePipes
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../guards/admin.guard';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ValidationPipe } from '../pipes/validation.pipe';

@Controller('courses')
export class CoursesController {
    constructor(private readonly courseService: CoursesService) { }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @UsePipes(new ValidationPipe())
    @Post()
    async create(@Body() createCourseDto: CreateCourseDto) {
        return await this.courseService.create(createCourseDto);
    }

    @Get()
    async findAll() {
        return await this.courseService.findAll();
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @UsePipes(new ValidationPipe())
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateCourse: UpdateCourseDto) {
        return await this.courseService.update(id, updateCourse);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.courseService.delete(id);
    }
}
