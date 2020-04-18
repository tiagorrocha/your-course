import { IsNotEmpty, IsMongoId } from "class-validator";

export class RegisterStudentClassDto {
    @IsMongoId({ message: "ClassId must be a mongodb id"})
    @IsNotEmpty({ message: "ClassId must not be empty"})
    class_id: string;

    @IsMongoId({ message: "StudentId must be a mongodb id"})
    @IsNotEmpty({ message: "StudentId must not be empty"})
    student_id: string;
}