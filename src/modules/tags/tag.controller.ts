import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { QueryTagDto, TagDto, UpdateTagDto } from './dtos/tag.dto'
import { TagService } from './tag.service'

@Controller('tags')
@ApiTags('Tags')
@ApiBearerAuth()

export class TagController {

  constructor(
    private readonly tagService: TagService
  ){}

  @Post()
  async createTag(@Body() tagDto: TagDto){
    return{
      message: 'Create tag successfully',
      data: await this.tagService.createTag(tagDto)
    }
  }

  @Get()
  async findManyTags(@Query() query: QueryTagDto){
    return {
      message: 'Get all tags successfully',
      data: await this.tagService.findManyTasks(query)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string){
    const user = await this.tagService.findOne(id)

    if(!user){
      throw new NotFoundException('Tag Not Found')
    }

    return {
      message: 'Find tag successfully',
      data: user.toJSON()
    }
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string){
    return {
      message: 'Delete tag successfully',
      data: await this.tagService.deleteOne({_id: id})
    }
  }

  @Patch(':id')
  async findOneAndUpdate(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto){
    return {
      message: 'Update tag successfully',
      data: await this.tagService.findOneAndUpdate({_id: id}, updateTagDto)
    }
  }

}