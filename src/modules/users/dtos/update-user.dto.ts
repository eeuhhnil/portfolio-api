import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsString} from "class-validator";
import {UserRole} from "../enums";

export class UpdateUserDto {
    @ApiProperty()
    @IsString()
    fullName?: string

    @ApiProperty()
    @IsString()
    username?: string

    @ApiProperty()
    @IsString()
    hashedPassword?: string

    @ApiProperty()
    @IsEnum(UserRole)
    role?: UserRole

    @ApiProperty()
    @IsString()
    gender?: string
}