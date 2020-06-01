import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor( private readonly usersService: UsersService,
    private readonly jwtService : JwtService) {}

  async validateUser(username : string, password : string){
    const user = await this.usersService.findOne(username);

    if (user && await bcrypt.compare(password, user.password)) {
      return this.usersService.sanitizeUser(user);
    }
    throw new UnauthorizedException("Invalid credentials");
  }
  async signPayload(user : any) {
    const payload = { username: user.username };
    return {
      user,
      access_token: this.jwtService.sign(payload,{ expiresIn: '7d'})
    };
  }
  async validateJwt(payload: any){
    return await this.usersService.findByPayload(payload);
  }
}