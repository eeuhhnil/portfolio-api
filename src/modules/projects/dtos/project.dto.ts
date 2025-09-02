import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { PaginationDTO } from '../../../common/dto/pagination.dto'

export class ProjectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  githubLink: string
}

export class UpdateProjectDto extends PartialType(ProjectDto) {
  @ApiPropertyOptional()
  @IsOptional()
  removeImage?: boolean
}
export class QueryProjectDto extends PaginationDTO {}
