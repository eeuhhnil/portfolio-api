import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { UserGender, UserRole } from '../enums'
import { Transform } from 'class-transformer'

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === '' ? undefined : value)
  fullName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === '' ? undefined : value)
  hashedPassword?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserRole)
  @Transform(({ value }) => value === '' ? undefined : value)
  role?: UserRole

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsEnum(UserGender)
  gender?: UserGender

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === '' ? undefined : value)
  avatar?: string
}
