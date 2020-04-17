import { Document } from 'mongoose';
export interface Class extends Document {
    readonly name : string;
    teacher_id ?: string;
    students ?: [String];
}