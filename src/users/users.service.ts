import { Model } from 'mongoose';
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Class } from 'src/classes/interfaces/class.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async findOne(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { username } = createUserDto;
    const user = await this.userModel.findOne({ username });
    if (user) {
      throw new ConflictException("User already exist");
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async findByPayload(payload: any) {
    const { username } = payload;
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findStudentsClass(studentsClass: Class) {
    const students = await this.userModel.find({ _id: { $in: studentsClass.students }}, 'name username email');
    return students;
  }

  sanitizeUser(user: User) {
    const result = {
      name: user.name,
      username: user.username,
      email: user.email,
    }
    return result;
  }
}