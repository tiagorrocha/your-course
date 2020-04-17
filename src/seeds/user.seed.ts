import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserSeed {
constructor(private readonly userService: UsersService) { }

@Command({ command: 'create:user', describe: 'create a user', autoExit: true })
async create() {
    const user = await this.userService.create({
        name: "Tiago Rocha",
        username: "admin",
        password: "admin",
        email: "tiagorocha@mail.com",
        typeUser: "ADMIN"
    });
    console.log(user);
}
}