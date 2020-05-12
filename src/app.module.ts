import {
  Module, NestModule, MiddlewareConsumer,
  RequestMethod
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from './courses/courses.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { StudentMiddleware } from './middleware/student.middleware';
import { TeacherMiddleware } from './middleware/teacher.middleware';
import { SeedsModule } from './seeds/seeds.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CoursesModule,
    AssignmentsModule,
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
    }),
    MongooseModule.forRoot(process.env.MONGO_URI,
      { useNewUrlParser: true, useUnifiedTopology: true }),
    SeedsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(StudentMiddleware)
      .forRoutes(
        { path: 'users/students', method: RequestMethod.POST }
      )
    consumer.apply(TeacherMiddleware)
      .forRoutes(
        { path: 'users/teachers', method: RequestMethod.POST }
      )
  }
}
