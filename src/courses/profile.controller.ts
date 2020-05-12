import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('courses/profile')
export class ProfileController {
    constructor(private readonly courseService: CoursesService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('assignments/:id')
    async findAllAssignments(@Param('id') id: string) {
        return await this.courseService.findAllAssignments(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('students/:id')
    async findAllStudents(@Param('id') id: string) {
        return await this.courseService.findAllStudents(id);
    }
}
