import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Assignment } from './interfaces/assignment.interface';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { Model } from 'mongoose';

@Injectable()
export class AssignmentsService {
    constructor(@InjectModel ('Assignment') private readonly classModel: Model <Assignment>){}

    async create(createAssignmentDto: CreateAssignmentDto){
        const createdAssignment = new this.classModel(createAssignmentDto);
        await createdAssignment.save();
        return createdAssignment;
    }

    async findAll(){
        return await this.classModel.find();
    }

    async update(id: string, updateAssignment: CreateAssignmentDto){
        try {
            const updatedAssignment = await this.classModel.findById(id);
            updatedAssignment.title = updateAssignment.title;
            updatedAssignment.description = updateAssignment.description;
            updatedAssignment.class_id = updateAssignment.class_id;
            return await updatedAssignment.save();
        } catch (error) {
            throw new NotFoundException('Assignment not found, update not completed');
        }
    }

    async delete(id: string){
        try {
            const assignmentDeleted = await this.classModel.findById(id);
            await assignmentDeleted.delete();
        } catch (error) {
            throw new NotFoundException ('Assignment not found, deletion not completed');
        }
    }
}
