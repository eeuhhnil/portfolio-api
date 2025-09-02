import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { PaginationDTO } from '../../../common/dto/pagination.dto'

export class CategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string
}
export class UpdateCategoryDto extends PartialType(CategoryDto) {}
export class QueryCategoryDto extends PaginationDTO {}
