import * as mongoose from 'mongoose';

export const AssginmentSchema = new mongoose.Schema({
  title: String,
  description : String,
  class_id : String
});