import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PaginationDTO } from '../../../common/dto/pagination.dto'

export class TagDto{
  @ApiProperty({
    example: 'machine learning'
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class QueryTagDto extends PaginationDTO{}

export class UpdateTagDto extends TagDto{}