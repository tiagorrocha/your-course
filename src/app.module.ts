import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassesModule } from './classes/classes.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { StudentMiddleware } from './middleware/student.middleware';
import { TeacherMiddleware } from './middleware/teacher.middleware';

@Module({
  imports: [AuthModule, UsersModule, ClassesModule, AssignmentsModule,
            MongooseModule.forRoot('mongodb://localhost/auth-jwt', { useNewUrlParser: true, useUnifiedTopology: true})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer){
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
