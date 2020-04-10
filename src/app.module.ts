import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassesModule } from './classes/classes.module';
import { AssignmentsModule } from './assignments/assignments.module';

@Module({
  imports: [AuthModule, UsersModule, ClassesModule, AssignmentsModule,
            MongooseModule.forRoot('mongodb://localhost/auth-jwt')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
