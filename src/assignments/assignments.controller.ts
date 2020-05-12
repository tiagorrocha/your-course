import {
    Controller, UseGuards, Post, Body, Put,
    Param, Delete, Get, Req, UsePipes
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeacherGuard } from '../guards/teacher.guard';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { AssignmentsService } from './assignments.service';
import { User } from '../utils/user.decorator';
import { Request } from 'express';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ValidationPipe } from '../pipes/validation.pipe';

@Controller('assignments')
export class AssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) { }

    @UseGuards(AuthGuard('jwt'), TeacherGuard)
    @UsePipes(new ValidationPipe())
    @Post()
    async create(@User() user: any,
        @Body() createAssignmentDto: CreateAssignmentDto) {
        return await this.assignmentsService.create(user._id, createAssignmentDto);
    }

    @Get()
    async findAll() {
        return await this.assignmentsService.findAll();
    }

    @UseGuards(AuthGuard('jwt'), TeacherGuard)
    @UsePipes(new ValidationPipe())
    @Put(':id')
    async update(@Req() request: Request,
        @User() user: any, @Param('id') id: string, @Body()
        updateAssignment: UpdateAssignmentDto) {
        const { course_id } = request.headers;
        return await this.assignmentsService
            .update(course_id, user._id, id, updateAssignment);
    }

    @UseGuards(AuthGuard('jwt'), TeacherGuard)
    @Delete(':id')
    async delete(@Req() request: Request,
        @User() user: any, @Param('id') id: string) {
        const { course_id } = request.headers;
        return await this.assignmentsService.delete(course_id, user._id, id);
    }
}
