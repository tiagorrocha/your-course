import { IsString,MinLength } from "class-validator";

export class UpdateAssignmentDto {
    @IsString({ message: "Description must be a string" })
    @MinLength(150, { message: "Description is too short" })
    description: string;
}