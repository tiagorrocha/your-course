import { Document } from 'mongoose';

export interface Assignment extends Document {
    readonly title : string;
    description : string;
    readonly course_id : string;
}