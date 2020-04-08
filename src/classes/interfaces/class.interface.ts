import { Document } from 'mongoose';
export interface Class extends Document {
    readonly name : string;
    readonly teacher_id ?: string;
    readonly students ?: [String];
}