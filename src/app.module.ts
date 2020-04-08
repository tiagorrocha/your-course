import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassesModule } from './classes/classes.module';

@Module({
  imports: [AuthModule, UsersModule, ClassesModule,
            MongooseModule.forRoot('mongodb://localhost/auth-jwt')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
