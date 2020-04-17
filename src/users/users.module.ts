import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema'
import { UsersController } from './user.controller';
import { ClassesModule } from 'src/classes/classes.module';
import { UserStudentsController } from './user.students.controller';
import { UserTeachersController } from './user.teachers.controller';

@Module({
  imports: [ClassesModule, MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UsersService],
  controllers: [UsersController, UserStudentsController, UserTeachersController],
  exports: [UsersService]
})
export class UsersModule { }
