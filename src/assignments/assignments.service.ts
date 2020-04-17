import { Injectable, NotFoundException, ConflictException, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Assignment } from './interfaces/assignment.interface';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { Model } from 'mongoose';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ClassesService } from 'src/classes/classes.service';

@Injectable()
export class AssignmentsService {
    constructor(@InjectModel('Assignment') private readonly assignmentModel: Model<Assignment>,
        @Inject(forwardRef(() => ClassesService)) private readonly classService: ClassesService
    ) { }

    async create(teacherId: any, createAssignmentDto: CreateAssignmentDto) {
        const { title, class_id } = createAssignmentDto;
        const verifyClass = await this.classService.findById(class_id);
        if (verifyClass.teacher_id !== teacherId.toString()) {
            throw new UnauthorizedException("Unauthorized to create assignments in this class");
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

    async findByClassId(id: string) {
        const assignments = await this.assignmentModel.find({ class_id: id }, 'title description');
        return assignments;
    }

    async update(classId: any, teacherId: any, id: string, updateAssignment: UpdateAssignmentDto) {
        const verifyClass = await this.classService.findById(classId);
        if (verifyClass.teacher_id !== teacherId.toString()) {
            throw new UnauthorizedException("Unauthorized to update assignments in this class");
        }
        const updatedAssignment = await this.assignmentModel.findById(id);
        if (!updatedAssignment) {
            throw new NotFoundException("Assignment not found, update not completed");
        }
        updatedAssignment.description = updateAssignment.description;
        return await updatedAssignment.save();
    }

    async delete(classId: any, teacherId: any, id: string) {
        const verifyClass = await this.classService.findById(classId);
        if (verifyClass.teacher_id !== teacherId.toString()) {
            throw new UnauthorizedException("Unauthorized to delete assignments in this class");
        }
        const assignmentDeleted = await this.assignmentModel.findById(id);
        if (!assignmentDeleted) {
            throw new NotFoundException("Assignment not found, deletion not completed");
        }
        await assignmentDeleted.delete();
    }
}
