import { IsMongoId, IsNotEmpty, IsArray, MaxLength } from "class-validator";

export class UpdateClassDto {
    @IsMongoId({ message: "TeacherId must be a mongodb id" })
    @IsNotEmpty({ message: "TeacherId must not be empty" })
    teacher_id: string;

    @IsArray({ message: "Students must be an array" })
    @IsNotEmpty({ message: "Students must not be empty" })
    students: [string];
}