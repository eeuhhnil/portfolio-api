import {
  Body,
  Controller,
  Delete,
  Get, HttpCode, HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { QueryTagDto, TagDto, UpdateTagDto } from './dtos/tag.dto'
import { TagService } from './tag.service'
import { Public } from '../auth/decorators'

@Controller('tags')
@ApiTags('Tags')
@ApiBearerAuth()
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({ status: 201, description: 'tag created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createTag(@Body() tagDto: TagDto) {
    return {
      message: 'Create tag successfully',
      data: await this.tagService.createTag(tagDto),
    }
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all tags with pagination and filters' })
  @ApiResponse({ status: 200, description: 'tags retrieved successfully' })
  async findManyTags(@Query() query: QueryTagDto) {
    return {
      message: 'Get all tags successfully',
      data: await this.tagService.findManyTasks(query),
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tag by ID' })
  @ApiResponse({ status: 200, description: 'tag retrieved successfully' })
  @ApiResponse({ status: 404, description: 'tag not found' })
  async findOne(@Param('id') id: string) {
    const user = await this.tagService.findOne(id)

    if (!user) {
      throw new NotFoundException('Tag Not Found')
    }

    return {
      message: 'Find tag successfully',
      data: user.toJSON(),
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete tag by ID' })
  @ApiResponse({ status: 200, description: 'tag deleted successfully' })
  @ApiResponse({ status: 404, description: 'tag not found' })
  async deleteOne(@Param('id') id: string) {
    return {
      message: 'Delete tag successfully',
      data: await this.tagService.deleteOne({ _id: id }),
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tag by ID' })
  @ApiResponse({ status: 200, description: 'tag updated successfully' })
  @ApiResponse({ status: 404, description: 'tag not found' })
  async findOneAndUpdate(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return {
      message: 'Update tag successfully',
      data: await this.tagService.findOneAndUpdate({ _id: id }, updateTagDto),
    }
  }
}
