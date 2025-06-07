import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString, Length, Matches} from "class-validator";

export class RegisterDto {
    @ApiProperty({
        type: String,
        example: "user@example.com",
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        type: String,
        example: "Password@123"
    })
    @IsString()
    @IsNotEmpty()
    @Matches(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/,
        {
            message:
                'Password must contain at least one uppercase letter, one number, and one special character',
        },
    )

    password: string;

    @ApiProperty({
        type: String,
        example: "Duong Thi Hue Linh"
    })
    @IsString()
    @Length(1,50)
    @IsNotEmpty()
    fullName: string;
}