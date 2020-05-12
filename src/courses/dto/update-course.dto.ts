import { IsMongoId, IsNotEmpty, IsArray} from "class-validator";

export class UpdateCourseDto {
    @IsMongoId({ message: "TeacherId must be a mongodb id" })
    @IsNotEmpty({ message: "TeacherId must not be empty" })
    teacher_id: string;

    @IsMongoId({
        each: true
    })
    @IsArray({ message: "Students must be an array" })
    @IsNotEmpty({ message: "Students must not be empty" })
    students?: string [];
}