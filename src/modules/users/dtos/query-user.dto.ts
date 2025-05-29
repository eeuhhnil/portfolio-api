import {UserGender, UserRole} from "../enums";
import {ApiProperty} from "@nestjs/swagger";
import {IsEnum, IsString} from "class-validator";

export class QueryUserDTO{
    @ApiProperty()
    @IsString()
    fullName?: string;

    @ApiProperty()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiProperty()
    @IsEnum(UserGender)
    gender?: UserGender;
}