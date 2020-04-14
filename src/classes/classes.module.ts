import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassSchema } from './schemas/class.schema';
import { ProfileController } from './profile.controller';
import { AssignmentsModule } from 'src/assignments/assignments.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[AssignmentsModule, UsersModule, MongooseModule.forFeature([{ name: 'Class', schema: ClassSchema }])],
  providers: [ClassesService],
  controllers: [ClassesController, ProfileController],
  exports: [ClassesService]
})
export class ClassesModule {}
