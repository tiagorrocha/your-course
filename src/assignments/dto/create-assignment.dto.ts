import { IsString, IsNotEmpty, IsMongoId, MinLength, MaxLength } from 'class-validator';
export class CreateAssignmentDto {
   
    @MinLength (10, { message: "Title is too short" })
    @MaxLength (50, { message: "Title is too long" })
    @IsString ({ message: "Title must be a string" })
    @IsNotEmpty({ message: "Title must not be empty"})
    title : string;

    @MinLength(150, { message: "Description must be longer than or equal to 150 characters" })
    @IsString({ message: "Description must be a string" })
    @IsNotEmpty({ message: "Description must not be empty " })
    description: string;

    @IsMongoId({ message: "ClassId must be a mongodb id" })
    @IsNotEmpty({ message: "ClassId must not be empty" })
    class_id:  string;
}