import {
    Injectable, NotFoundException, ConflictException,
    Inject, forwardRef, UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Assignment } from './interfaces/assignment.interface';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { Model } from 'mongoose';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class AssignmentsService {
    constructor(
        @InjectModel('Assignment')
        private readonly assignmentModel: Model<Assignment>,
        @Inject(forwardRef(() => CoursesService))
        private readonly coursesService: CoursesService
    ) { }

    async create(teacherId: any, createAssignmentDto: CreateAssignmentDto) {
        const { title, course_id } = createAssignmentDto;
        const course = await this.coursesService.findById(course_id);
        if (course.teacher_id !== teacherId.toString()) {
            throw new UnauthorizedException("Unauthorized to " +
                "create assignments in this course");
        }
        const assignment = await this.assignmentModel.findOne({ title });
        if (assignment) {
            throw new ConflictException("Assignment already exist");
        }
        const createdAssignment = new this.assignmentModel(createAssignmentDto);
        await createdAssignment.save();
        return createdAssignment;
    }

    async findAll() {
        return await this.assignmentModel.find();
    }

    async findByCourseId(id: string) {
        const assignments = await this.assignmentModel.find({ course_id: id },
            'title description');
        return assignments;
    }

    async update(courseId: any, teacherId: any, id: string,
        updateAssignment: UpdateAssignmentDto) {
        const course = await this.coursesService.findById(courseId);
        if (course.teacher_id !== teacherId.toString()) {
            throw new UnauthorizedException("Unauthorized to update assignments"
                + " in this course");
        }
        const updatedAssignment = await this.assignmentModel.findById(id);
        if (!updatedAssignment) {
            throw new NotFoundException("Assignment not found,"
                + " update not completed");
        }
        updatedAssignment.description = updateAssignment.description;
        return await updatedAssignment.save();
    }

    async delete(courseId: any, teacherId: any, id: string) {
        const course = await this.coursesService.findById(courseId);
        if (course.teacher_id !== teacherId.toString()) {
            throw new UnauthorizedException("Unauthorized"
                + " to delete assignments in this course");
        }
        const deletedAssignment = await this.assignmentModel.findById(id);
        if (!deletedAssignment) {
            throw new NotFoundException("Assignment not found,"
                + " deletion not completed");
        }
        await deletedAssignment.remove();
    }
}
