import * as request from 'supertest';
import { app, database } from '../constants';
import * as mongoose from 'mongoose';
import { HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
describe("AUTH", () => {

  const isJWTToken = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/

  beforeAll(async () => {
    await mongoose.connect(database);
  });

  afterAll(async () => {
    await mongoose.connection.collection("users")
      .deleteMany({ typeUser: /TEACHER/ });
    await mongoose.connection.collection("users")
      .deleteMany({ typeUser: /STUDENT/ });
    await mongoose.disconnect();
  });

  let adminToken: string;
  it("/POST should login admin user", () => {
    return request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({
        username: "admin",
        password: "admin"
      })
      .expect(({ body }) => {
        adminToken = body.access_token;
        expect(body.access_token).toMatch(isJWTToken);
        expect(body.user.username).toEqual("admin");
        expect(body.user.password).toBeUndefined();
        expect(body.user.typeUser).toEqual("ADMIN");
      })
      .expect(HttpStatus.CREATED);
  });

  it("/POST should login teacher user", async () => {
    const teacherUser: CreateUserDto = {
      name: "Teacher",
      username: "teacher",
      password: "teacher123",
      email: "teacher@mail.com",
      typeUser: "TEACHER"
    };
    const teacherExists = await mongoose.connection.collection("users").findOne({
      username: teacherUser.username
    })
    if (!teacherExists) {
      await axios.post(`${app}/users/teachers`, teacherUser,
        {
          headers: { authorization: `Bearer ${adminToken}` }
        });
    }
    const loginResult = await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({
        username: "teacher",
        password: "teacher123"
      })
      .expect(HttpStatus.CREATED);

    const { body } = loginResult;
    expect(body.access_token).toMatch(isJWTToken);
    expect(body.user.username).toEqual("teacher");
    expect(body.user.password).toBeUndefined();
    expect(body.user.typeUser).toEqual("TEACHER");
  });


  it("/POST should login student user", async () => {
    const studentUser: CreateUserDto = {
      name: "Student",
      username: "student",
      password: "student123",
      email: "student@mail.com",
      typeUser: "STUDENT"
    }
    const studentExists = await mongoose.connection.collection("users").findOne({
      username: studentUser.username
    });

    if (!studentExists) {
      await axios.post(`${app}/users/students`, studentUser);
    }
    const loginResult = await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({
        username: "student",
        password: "student123"
      })
      .expect(HttpStatus.CREATED);

    const { body } = loginResult;
    expect(body.access_token).toMatch(isJWTToken);
    expect(body.user.username).toEqual("student");
    expect(body.user.password).toBeUndefined();
    expect(body.user.typeUser).toEqual("STUDENT");
  });
});