import { Controller, UseGuards, Post, Body, Put, Param, Delete, Get, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeacherGuard } from 'src/guards/teacher.guard';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { AssignmentsService } from './assignments.service';
import { User } from 'src/utils/user.decorator';
import { Request } from 'express';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Controller('assignments')
export class AssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) { }

    @UseGuards(AuthGuard('jwt'), TeacherGuard)
    @Post()
    async create(@User() user: any, @Body() createAssignmentDto: CreateAssignmentDto) {
        return await this.assignmentsService.create(user._id, createAssignmentDto);
    }

    @Get()
    async findAll() {
        return await this.assignmentsService.findAll();
    }

    @UseGuards(AuthGuard('jwt'), TeacherGuard)
    @Put(':id')
    async update(@Req() request: Request, @User() user: any, @Param('id') id: string, @Body()
    updateAssignment: UpdateAssignmentDto) {
        const { class_id } = request.headers;
        return await this.assignmentsService.update(class_id, user._id, id, updateAssignment);
    }

    @UseGuards(AuthGuard('jwt'), TeacherGuard)
    @Delete(':id')
    async delete(@Req() request: Request, @User() user: any, @Param('id') id: string) {
        const { class_id } = request.headers;
        return await this.assignmentsService.delete(class_id, user._id, id);
    }
}
