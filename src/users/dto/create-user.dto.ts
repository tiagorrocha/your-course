import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString({ message: "Name must be a string" })
    @IsNotEmpty({ message: "Name must not be empty" })
    name: string;

    @IsString({ message: "Username must be a string" })
    @IsNotEmpty({ message: "Username must not be empty" })
    username: string;

    @MinLength(8, { message: "Password must be longer than or equal to 8 characters" })
    @IsString({ message: "Password must be a string" })
    @IsNotEmpty({ message: "Password must not be empty" })
    password: string;

    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty({ message: "Email must not be empty" })
    email: string;

    @IsString({ message: "TypeUser must be a string" })
    @IsNotEmpty({ message: "TypeUser must not be empty" })
    typeUser: string;
}