import {
    Injectable, ConflictException, NotFoundException,
    Inject, forwardRef
} from '@nestjs/common';
import { Course } from './interfaces/course.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { AssignmentsService } from '../assignments/assignments.service';
import { UsersService } from '../users/users.service';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel('Course')
        private readonly courseModel: Model<Course>,
        @Inject(forwardRef(() => AssignmentsService))
        private readonly assignmentsService: AssignmentsService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) { }

    async create(createCourseDto: CreateCourseDto) {
        const { name } = createCourseDto;
        const course = await this.courseModel.findOne({ name });
        if (course) {
            throw new ConflictException("Course already exists");
        }
        const createdCourse = new this.courseModel(createCourseDto);
        await createdCourse.save();
        return createdCourse;
    }

    async findAll() {
        return await this.courseModel.find();
    }

    async findAllAssignments(courseId: string) {
        const assignments = await this.assignmentsService.findByCourseId(courseId);
        return assignments;
    }

    async findAllStudents(courseId: string) {
        const course = await this.courseModel.findById(courseId);
        const students = await this.usersService.findStudentsCourse(course);
        return students;
    }

    async findStudentCourses(studentId: string) {
        const studentCourses = await this.courseModel.find({ students: studentId },
            'name username email');
        return studentCourses;
    }

    async findTeacherCourses(teacherId: string) {
        const teacherCourses = await this.courseModel.find({ teacher_id: teacherId },
            'name');
        return teacherCourses;
    }

    async findById(courseId: string) {
        const result = await this.courseModel.findById(courseId);
        if (!result) {
            throw new NotFoundException("Course not found");
        }
        return result;
    }

    async update(courseId: string, updateCourse: UpdateCourseDto) {
        try {
            const updatedCourse = await this.courseModel.findById(courseId);
            updatedCourse.teacher_id = updateCourse.teacher_id;
            updatedCourse.students = updateCourse.students;
            return await updatedCourse.save();
        } catch (error) {
            throw new NotFoundException("Course not found, update not completed");
        }
    }

    async delete(courseId: string) {
        try {
            const deletedCourse = await this.courseModel.findById(courseId);
            await deletedCourse.remove();
        } catch (error) {
            throw new NotFoundException("Course not found, deletion not completed");
        }
    }
}
