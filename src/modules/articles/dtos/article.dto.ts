import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { PaginationDTO } from '../../../common/dto/pagination.dto'
import { PartialType } from '@nestjs/mapped-types'

export class ArticleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  slug: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional()
  @IsMongoId({ each: true })
  @IsOptional()
  tags: string[]
}

export class UpdateArticleDto extends PartialType(ArticleDto) {}
export class QueryArticleDto extends PaginationDTO {}
