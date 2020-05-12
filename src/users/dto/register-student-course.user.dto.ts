import { IsNotEmpty, IsMongoId } from "class-validator";

export class RegisterStudentCourseDto {
    @IsMongoId({ message: "CourseId must be a mongodb id"})
    @IsNotEmpty({ message: "CourseId must not be empty"})
    course_id: string;

    @IsMongoId({ message: "StudentId must be a mongodb id"})
    @IsNotEmpty({ message: "StudentId must not be empty"})
    student_id: string;
}