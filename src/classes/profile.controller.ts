import { Controller, Get, Param, UseGuards, Put, Post } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('classes/profile')
export class ProfileController {
    constructor(private readonly classesService: ClassesService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('assignments/:id')
    async findAllAssignments(@Param('id') id: string) {
        return await this.classesService.findAllAssignments(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('students/:id')
    async findAllStudents(@Param('id') id: string) {
        return await this.classesService.findAllStudents(id);
    }
}
