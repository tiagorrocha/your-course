import { IsString, IsArray, IsMongoId, IsNotEmpty } from "class-validator";

export class CreateClassDto {
   
    @IsString({ message: "Name must be a string" })
    @IsNotEmpty({ message: "Name must not be empty" } )
    name : string;

    @IsMongoId({ message: "TeacherId must be a mongodb id" })
    @IsNotEmpty({ message: "TeacherId must not be empty" })
    teacher_id: string;
}