import { Model } from 'mongoose';
import {
  Injectable, ConflictException, NotFoundException, Inject,
  forwardRef, UnauthorizedException,
  ForbiddenException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Course } from '../courses/interfaces/course.interface';
import { CoursesService } from '../courses/courses.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterStudentCourseDto } from './dto/register-student-course.user.dto';
import { UpdateCourseDto } from '../courses/dto/update-course.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>,
    @Inject(forwardRef(() => CoursesService))
    private readonly coursesService: CoursesService) { }

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { username } = createUserDto;
    const user = await this.userModel.findOne({ username });
    if (user) {
      throw new ConflictException("User already exist");
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async registerStudentCourse(studentId: any,
    regStudentCourse: RegisterStudentCourseDto) {
    const { course_id, student_id } = regStudentCourse;
    if (student_id !== studentId.toString()) {
      throw new UnauthorizedException("Unauthorized to register this student");
    }
    const course = await this.coursesService.findById(course_id);
    if (course.students.includes(student_id)) {
      throw new ConflictException("Student already registered in this course");
    }
    if (course.students.length >= 50) {
      throw new ForbiddenException("Register in this course is not allowed");
    }
    course.students.push(student_id);
    const updateCourse: UpdateCourseDto = {
      teacher_id: course.teacher_id,
      students: course.students
    }
    const updatedCourse = await this.coursesService.update(course_id, updateCourse);
    return updatedCourse;
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return this.sanitizeUser(user);
  }

  async findByPayload(payload: any) {
    const { username } = payload;
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findStudentsCourse(course: Course) {
    const students = await this.userModel
      .find({ _id: { $in: course.students } }, 'name username email');
    return students;
  }

  async findStudentCourses(studentId: string) {
    const studentCourses = this.coursesService.findStudentCourses(studentId);
    return studentCourses;
  }

  async findTeacherCourses(teacherId: string) {
    const teacherCourses = this.coursesService.findTeacherCourses(teacherId);
    return teacherCourses;
  }

  async update(id: string, updateUser: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.findById(id);
      updatedUser.name = updateUser.name;
      updatedUser.email = updateUser.email;
      updatedUser.password = await bcrypt.hash(updateUser.password, 10)
      await updatedUser.save();
      return this.sanitizeUser(updatedUser);
    } catch (error) {
      throw new NotFoundException("User not found, update not completed");
    }
  }

  async delete(id: string) {
    try {
      const deletedUser = await this.userModel.findById(id);
      if (deletedUser.typeUser === "ADMIN") {
        throw new UnauthorizedException("Unauthorized to delete the admin user");
      }
      await deletedUser.remove();
    } catch (error) {
      throw new NotFoundException("User not found, deletion not completed");
    }
  }

  sanitizeUser(user: User) {
    const result = user.toObject();
    delete result['password'];
    return result;
  }
}