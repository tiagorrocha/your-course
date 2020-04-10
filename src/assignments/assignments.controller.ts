import { Controller, UseGuards, Post, Body, Put, Param, Delete, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeacherGuard } from 'src/guards/teacher.guard';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { AssignmentsService } from './assignments.service';

@Controller('assignments')
export class AssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService){}

    @UseGuards(AuthGuard('jwt'), TeacherGuard)
    @Post()
    async create(@Body() createAssignmentDto: CreateAssignmentDto){
        return await this.assignmentsService.create(createAssignmentDto);
    }

    @Get()
    async findAll(){
        return await this.assignmentsService.findAll();
    }

    @UseGuards(AuthGuard('jwt'), TeacherGuard)
    @Put(':id')
    async update(@Param ('id') id: string, @Body() 
                updateAssignment: CreateAssignmentDto){
        return await this.assignmentsService.update(id, updateAssignment);
    }

    @UseGuards(AuthGuard('jwt'), TeacherGuard)
    @Delete(':id')
    async delete(@Param('id') id: string){
        return await this.assignmentsService.delete(id);
    }
}
