import { Module } from '@nestjs/common';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { AssginmentSchema } from './schemas/assignment.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'Assignment', schema: AssginmentSchema }])],
  providers: [AssignmentsService],
  controllers: [AssignmentsController],
  exports: [AssignmentsService]
  
})
export class AssignmentsModule {}
