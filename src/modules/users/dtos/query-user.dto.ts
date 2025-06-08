import { UserGender, UserRole } from '../enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from '../../../common/dto/pagination.dto';
import { Transform } from 'class-transformer';

export class QueryUserDTO extends PaginationDTO {
  @ApiProperty({
    type: [String],
    enum: UserRole,
    enumName: 'UserRole',
    example: [UserRole.USER],
    required: false,
  })
  @IsArray({ message: `Roles must be an array` })
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null) return undefined;
    return [value];
  })
  @IsEnum(UserRole, {
    each: true,
    message: `Roles must be one of: ${Object.values(UserRole).join(', ')}`,
  })
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    enum: UserGender,
    enumName: 'UserGender',
    example: UserGender.MALE,
    required: false,
  })
  @IsEnum(UserGender, {
    message: `Gender must be one of: ${Object.values(UserGender).join(', ')}`,
  })
  @IsOptional()
  gender?: UserGender;
}
