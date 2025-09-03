import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { PaginationDTO } from '../../../common/dto/pagination.dto'
import { PartialType } from '@nestjs/mapped-types'

export class CreateServiceDto {
  @ApiProperty({ description: 'Service title' })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiPropertyOptional({ description: 'Service description' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ description: 'Category ID' })
  @IsNotEmpty()
  @IsMongoId()
  category: string

  @ApiPropertyOptional({ description: 'Service icon' })
  @IsOptional()
  @IsString()
  icon?: string

  @ApiPropertyOptional({ description: 'Service price', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number

  @ApiPropertyOptional({ description: 'Is service active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

export class QueryServiceDto extends PaginationDTO {
  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @IsMongoId()
  category?: string

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
