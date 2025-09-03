import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CategoryService } from './category.service'
import { CategoryDto, QueryCategoryDto, UpdateCategoryDto } from './dtos/category.dto'

@Controller('categories')
@ApiBearerAuth()
@ApiTags('Categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'category created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createOne(@Body() payload: CategoryDto) {
    return {
      message: 'Create category successfully',
      data: await this.categoryService.createOne(payload),
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories with pagination and filters' })
  @ApiResponse({ status: 200, description: 'categories retrieved successfully' })
  async findMany(@Query() query: QueryCategoryDto) {
    return {
      message: 'Get all categories successfully',
      data: await this.categoryService.findMany(query),
    }
  }

  @Get(':categoryId')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'category not found' })
  async findOneById(@Param('categoryId') categoryId: string) {
    return {
      message: 'Get category by id successfully',
      data: await this.categoryService.findOneById(categoryId),
    }
  }

  @Patch(':categoryId')
  @ApiOperation({ summary: 'Update category by ID' })
  @ApiResponse({ status: 200, description: 'category updated successfully' })
  @ApiResponse({ status: 404, description: 'category not found' })
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiResponse({ status: 200, description: 'category deleted successfully' })
  @ApiResponse({ status: 404, description: 'category not found' })
  async deleteOne(@Param('categoryId') categoryId: string) {
    return {
      message: 'Delete category successfully',
      data: await this.categoryService.deleteOne({ _id: categoryId }),
    }
  }
}
