import { Document } from 'mongoose';
export interface Course extends Document {
    readonly name : string;
    teacher_id ?: string;
    students ?: string [];
}