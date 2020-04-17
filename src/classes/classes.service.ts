import { Injectable, ConflictException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { Class } from './interfaces/class.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClassDto } from './dto/create-class.dto';
import { AssignmentsService } from 'src/assignments/assignments.service';
import { UsersService } from 'src/users/users.service';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
    constructor(@InjectModel('Class') private readonly classModel: Model<Class>,
        @Inject(forwardRef(() => AssignmentsService))
        private readonly assignmentsService: AssignmentsService,
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService) { }

    async create(createClassDto: CreateClassDto) {
        const { name } = createClassDto;
        const verifyClass = await this.classModel.findOne({ name });
        if (verifyClass) {
            throw new ConflictException('Class alread exist');
        }
        const createdClass = new this.classModel(createClassDto);
        await createdClass.save();
        return createdClass;
    }

    async findAll() {
        return await this.classModel.find();
    }

    async findAllAssignments(id: string) {
        const assignments = await this.assignmentsService.findByClassId(id);
        return assignments;
    }

    async findAllStudents(id: string) {
        const studentsClass = await this.classModel.findById(id);
        const students = await this.usersService.findStudentsClass(studentsClass);
        return students;
    }

    async findClassesStudent(studentId: string) {
        const classesStudent = await this.classModel.find({ students: studentId }, 'name username email');
        return classesStudent;
    }

    async findClassesTeacher(teacherId: string) {
        const classesTeacher = await this.classModel.find({ teacher_id: teacherId }, 'name');
        return classesTeacher;
    }

    async findById(id: string) {
        const result = await this.classModel.findById(id);
        if(!result){
            throw new NotFoundException("Class not found");
        }
        return result;
    }

    async update(id: string, updateClass: UpdateClassDto) {
        try {
            const updatedClass = await this.classModel.findById(id);
            updatedClass.teacher_id = updateClass.teacher_id;
            updatedClass.students = updateClass.students;
            return await updatedClass.save();
        } catch (error) {
            throw new NotFoundException("Class not found, update not completed");
        }
    }

    async delete(id: string) {
        try {
            const classDeleted = await this.classModel.findById(id);
            await classDeleted.delete();
        } catch (error) {
            throw new NotFoundException("Class not found, deletion not completed");
        }
    }
}
