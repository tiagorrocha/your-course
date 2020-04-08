import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassSchema } from './schemas/class.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'Class', schema: ClassSchema }])],
  providers: [ClassesService],
  controllers: [ClassesController],
  exports: [ClassesService]
})
export class ClassesModule {}
