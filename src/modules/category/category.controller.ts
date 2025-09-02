import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CategoryService } from './category.service'
import { CategoryDto, QueryCategoryDto, UpdateCategoryDto } from './dtos/category.dto'

@Controller('categories')
@ApiBearerAuth()
@ApiTags('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createOne(@Body() payload: CategoryDto) {
    return {
      message: 'Create category successfully',
      data: await this.categoryService.createOne(payload),
    }
  }

  @Get()
  async findMany(@Query() query: QueryCategoryDto) {
    return {
      message: 'Get all categories successfully',
      data: await this.categoryService.findMany(query),
    }
  }

  @Get(':categoryId')
  async findOneById(@Param('categoryId') categoryId: string) {
    return {
      message: 'Get category by id successfully',
      data: await this.categoryService.findOneById(categoryId),
    }
  }

  @Patch(':categoryId')
  async findOneAndUpdate(@Param('categoryId') categoryId: string, @Body() payload: UpdateCategoryDto,
  ) {
    return {
      message: 'Update category successfully',
      data: await this.categoryService.findOneAndUpdate(
        { _id: categoryId },
        payload,
      ),
    }
  }

  @Delete(':categoryId')
  async deleteOne(@Param('categoryId') categoryId: string) {
    return {
      message: 'Delete category successfully',
      data: await this.categoryService.deleteOne({ _id: categoryId }),
    }
  }
}
