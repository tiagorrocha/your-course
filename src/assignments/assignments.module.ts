import { Module, forwardRef } from '@nestjs/common';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { AssginmentSchema } from './schemas/assignment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [forwardRef(() => CoursesModule),
  MongooseModule.forFeature([{ name: 'Assignment', schema: AssginmentSchema }])],
  providers: [AssignmentsService],
  controllers: [AssignmentsController],
  exports: [AssignmentsService]

})
export class AssignmentsModule { }
