import {
  Body,
  Controller,
  Delete,
  Get, HttpCode, HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ArticleDto, QueryArticleDto, UpdateArticleDto } from './dtos'
import { AuthUser } from '../auth/decorators'
import { AuthPayload } from '../auth/types'
import { ArticleService } from './article.service'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@Controller('articles')
@ApiTags('Articles')
@ApiBearerAuth()
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({ status: 201, description: 'article created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createOne(
    @Body() payload: ArticleDto,
    @AuthUser() authUser: AuthPayload,
  ) {
    return {
      message: 'Create article',
      data: await this.articleService.createOne({
        author: authUser.sub,
        ...payload,
      }),
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles with pagination and filters' })
  @ApiResponse({ status: 200, description: 'articles retrieved successfully' })
  async findAll(@Query() query: QueryArticleDto) {
    return {
      message: 'Get all articles',
      data: await this.articleService.findAll(query),
    }
  }

  @Get(':articleId')
  @ApiOperation({ summary: 'Get article by ID' })
  @ApiResponse({ status: 200, description: 'article retrieved successfully' })
  @ApiResponse({ status: 404, description: 'article not found' })
  async findOne(@Param('articleId') articleId: string) {
    return {
      message: 'Get article witt Id',
      data: await this.articleService.findOne(articleId),
    }
  }

  @Patch(':articleId')
  @ApiOperation({ summary: 'Update article by ID' })
  @ApiResponse({ status: 200, description: 'article updated successfully' })
  @ApiResponse({ status: 404, description: 'article not found' })
  async UpdateArticle(
    @Param('articleId') articleId: string,
    @Body() payload: UpdateArticleDto,
  ) {
    return {
      message: 'Update article',
      data: await this.articleService.findOneAndUpdateOne(
        { _id: articleId },
        payload,
      ),
    }
  }

  @Delete(':articleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete article by ID' })
  @ApiResponse({ status: 200, description: 'article deleted successfully' })
  @ApiResponse({ status: 404, description: 'article not found' })
  async remove(@Param('articleId') articleId: string) {
    return {
      message: 'Delete article',
      data: await this.articleService.remove(articleId),
    }
  }
}
