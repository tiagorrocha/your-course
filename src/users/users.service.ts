import { Model } from 'mongoose';
import { Injectable, ConflictException, NotFoundException, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Class } from 'src/classes/interfaces/class.interface';
import { ClassesService } from 'src/classes/classes.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterStudentClassDto } from './dto/register-student-class.user.dto';
import { UpdateClassDto } from 'src/classes/dto/update-class.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>,
    @Inject(forwardRef(() => ClassesService))
    private readonly classService: ClassesService) { }

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

  async registerStudentClass(studentId: any, regStudentClass: RegisterStudentClassDto){
    const { class_id, student_id } = regStudentClass;
    if(student_id !== studentId.toString()){
      throw new UnauthorizedException("Unauthorized to register this student");
    }
    const verifyClass = await this.classService.findById(class_id);
    if(verifyClass.students.includes(student_id)){
      throw new ConflictException("Student already registered in this class");
    }
    const updateClass: UpdateClassDto = {
      teacher_id: verifyClass.teacher_id,
      students: verifyClass.students
    }
    const classUpdated = await this.classService.update(class_id, updateClass);
    return classUpdated;
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

  async findStudentsClass(studentsClass: Class) {
    const students = await this.userModel.find({ _id: { $in: studentsClass.students } }, 'name username email');
    return students;
  }

  async findClassesStudent(studentId: string) {
    const classes = this.classService.findClassesStudent(studentId);
    return classes;
  }

  async findClassesTeacher(teacherId: string) {
    const classes = this.classService.findClassesTeacher(teacherId);
    return classes;
  }

  async update(id: string, updateUser: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.findById(id);
      updatedUser.name = updateUser.name;
      updatedUser.email = updateUser.email;
      await updatedUser.save();
      return this.sanitizeUser(updatedUser);
    } catch (error) {
      throw new NotFoundException("User not found, update not completed");
    }
  }

  async delete(id: string) {
    try {
      const userDeleted = await this.userModel.findById(id);
      if (userDeleted.typeUser === "ADMIN") {
        throw new UnauthorizedException("Unauthorized to delete the admin user");
      }
      await userDeleted.remove();
    } catch (error) {
      throw new NotFoundException("User not found, deletion not completed");
    }
  }

  sanitizeUser(user: User) {
    const result = user.toObject();
    delete result['password'];
    delete result['typeUser'];
    return result;
  }
}