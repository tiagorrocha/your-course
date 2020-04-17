import { Document } from 'mongoose';

export interface Assignment extends Document {
    readonly title : string;
    description : string;
    readonly class_id : string;
}