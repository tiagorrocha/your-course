import * as mongoose from 'mongoose';

export const CourseSchema = new mongoose.Schema({
  name : String,
  teacher_id: String,
  students: [String]
});