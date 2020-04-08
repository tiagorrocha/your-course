import { Injectable, ConflictException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Class } from './interfaces/class.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClassDto } from './dto/create-class.dto';

@Injectable()
export class ClassesService {
    constructor(@InjectModel('Class') private readonly classModel: Model<Class>){}

    async create(createClassDto: CreateClassDto){
        const { name } = createClassDto;
        const verifyClass = await this.classModel.findOne({name});
        if(verifyClass){
            throw new ConflictException('Class alread exist');
        }
        const createdClass = new this.classModel(createClassDto);
        await createdClass.save();
        return createdClass;
    }

    async findAll(){
        return await this.classModel.find();
    }

    async update(id: string, updateClass: CreateClassDto){
        try {
            const updatedClass = await this.classModel.findById(id);
            updatedClass.name = updateClass.name;
            updatedClass.teacher_id = updateClass.teacher_id;
            updatedClass.students = updateClass.students;
            return await updatedClass.save();
        } catch (error) {
            throw new NotFoundException('Class not found, update not completed');
        }
    }

    async delete(id: string){
        try {
            const classDeleted = await this.classModel.findById(id);
            await classDeleted.delete();
        } catch (error) {
            throw new NotFoundException('Class not found, deletion not completed');
        }
    }
}
