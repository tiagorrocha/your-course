import * as mongoose from 'mongoose';

export const ClassSchema = new mongoose.Schema({
  name : String,
  teacher_id: String,
  students: [String]
});