import * as request from 'supertest';
import { database, app } from '../constants';
import * as mongoose from 'mongoose';
import axios from 'axios';
import { CreateCourseDto } from '../../src/courses/dto/create-course.dto';
import { HttpStatus } from '@nestjs/common';
import { UpdateCourseDto } from '../../src/courses/dto/update-course.dto';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';

describe("COURSES", () => {
    const createCourse: CreateCourseDto = {
        name: "Course One"
    };
    let adminToken: string;
    let courseId: string;

    beforeAll(async () => {
        await mongoose.connect(database);
    });

    afterAll(async () => {
        await mongoose.connection.collection("users")
            .deleteMany({ typeUser: /TEACHER/ });
        await mongoose.connection.collection("users")
            .deleteMany({ typeUser: /STUDENT/ });
        await mongoose.connection.dropCollection("courses");
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        const loginResult = await axios.post(`${app}/auth/login`, {
            username: "admin",
            password: "admin"
        });
        const { access_token } = loginResult.data;
        adminToken = access_token;
    });

    it("/POST should create course", async () => {
        const createdCourse = await request(app)
            .post("/courses")
            .set("Authorization", `Bearer ${adminToken}`)
            .set("Accept", "application/json")
            .send(createCourse)
            .expect(HttpStatus.CREATED);

        const { body } = createdCourse;
        courseId = body._id;
        expect(body._id).toBeDefined();
        expect(body.name).toEqual(createCourse.name);
    });

    it("/POST should reject duplicate course registration ", async () => {
        const createdCourse = await request(app)
            .post("/courses")
            .set("Authorization", `Bearer ${adminToken}`)
            .set("Accept", "application/json")
            .send(createCourse)
            .expect(HttpStatus.CONFLICT);

        const { body } = createdCourse;
        expect(body.message).toEqual("Course already exists");
    });

    it("/GET should list all courses", () => {
        return request(app)
            .get("/courses")
            .expect(200);
    });

    it("/PUT should update course", async () => {
        let studentId: string;
        let teacherId: string;
        const createCourse: CreateCourseDto = {
            name: "Course Any"
        };
        const createdCourse = await request(app)
            .post(`/courses`)
            .set("Authorization", `Bearer ${adminToken}`)
            .set("Accept", "application/json")
            .send(createCourse);

        const courseId = createdCourse.body._id;

        const teacherUser: CreateUserDto = {
            name: "Teacher",
            username: "teacher",
            password: "teacher123",
            email: "teacher@mail.com",
            typeUser: "TEACHER"
        };
        const teacherExists = await mongoose.connection
            .collection("users").findOne({
                username: teacherUser.username
            });
        if (!teacherExists) {
            const createdTeacher = await request(app)
                .post("/users/teachers")
                .set("Authorization", `Bearer ${adminToken}`)
                .set("Accept", "application/json")
                .send(teacherUser);

            teacherId = createdTeacher.body._id;
        } else {
            teacherId = teacherExists._id;
        }

        const studentUser: CreateUserDto = {
            name: "Student",
            username: "student",
            password: "student123",
            email: "student@mail.com",
            typeUser: "STUDENT"
        };
        const studentExists = await mongoose.connection
            .collection("users").findOne({
                username: studentUser.username
            });
        if (!studentExists) {
            const createdStudent = await request(app)
                .post("/users/students")
                .set("Accept", "application/json")
                .send(studentUser);

            studentId = createdStudent.body._id;
        } else {
            studentId = studentExists._id;
        }

        const updateCourse: UpdateCourseDto = {
            teacher_id: teacherId,
            students: [studentId]
        }
        const postResult = await request(app)
            .put(`/courses/${courseId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .set("Accept", "application/json")
            .send(updateCourse)
            .expect(HttpStatus.OK);
        const { body } = postResult;
        expect(body._id).toEqual(courseId);
        expect(body.name).toEqual(createCourse.name);
        expect(body.teacher_id).toEqual(teacherId.toString());
        expect(body.students).toHaveLength(updateCourse.students.length)
    });

    it("/DELETE should delete course", () => {
        return request(app)
            .delete(`/courses/${courseId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(HttpStatus.OK)
    })
});