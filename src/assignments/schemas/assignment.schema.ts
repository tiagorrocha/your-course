import * as mongoose from 'mongoose';

export const AssginmentSchema = new mongoose.Schema({
  title: String,
  description : String,
  course_id : String
});