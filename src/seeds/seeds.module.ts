import { Module } from '@nestjs/common';
import { UserSeed } from './user.seed';
import { UsersModule } from '../users/users.module';
import { CommandModule } from 'nestjs-command';

@Module({
    imports: [UsersModule, CommandModule],
    providers: [UserSeed],
    exports: [UserSeed]
})
export class SeedsModule {}

