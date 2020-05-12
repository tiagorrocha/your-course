import { Module, forwardRef } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from './schemas/course.schema';
import { ProfileController } from './profile.controller';
import { AssignmentsModule } from '../assignments/assignments.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AssignmentsModule, forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }])],
  providers: [CoursesService],
  controllers: [CoursesController, ProfileController],
  exports: [CoursesService]
})
export class CoursesModule { }
