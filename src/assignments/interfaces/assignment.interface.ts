import { Document } from 'mongoose';

export interface Assignment extends Document {
    readonly title : string;
    readonly description : string;
    readonly class_id : string;
}