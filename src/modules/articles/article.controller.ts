import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get, HttpCode, HttpStatus,
  Param,
  Patch,
  Post,
  Query, UploadedFile, UseInterceptors,
} from '@nestjs/common'
import { ArticleDto, QueryArticleDto, UpdateArticleDto } from './dtos'
import { AuthUser, Public } from '../auth/decorators'
import { AuthPayload } from '../auth/types'
import { ArticleService } from './article.service'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

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

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all articles with pagination and filters' })
  @ApiResponse({ status: 200, description: 'articles retrieved successfully' })
  async findAll(@Query() query: QueryArticleDto) {
    return {
      message: 'Get all articles',
      data: await this.articleService.findAll(query),
    }
  }

  @Public()
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


  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        content: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
        removeImage: {
          type: 'boolean',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (
          !file.mimetype.startsWith('image/') ||
          file.mimetype === 'image/gif'
        ) {
          return callback(
            new BadRequestException('Only images accepted'),
            false,
          )
        }
        callback(null, true)
      },
    }),
  )
  @Patch(':articleId')
  @ApiOperation({ summary: 'Update article by ID' })
  @ApiResponse({ status: 200, description: 'article updated successfully' })
  @ApiResponse({ status: 404, description: 'article not found' })
  async UpdateArticle(
    @Param('articleId') articleId: string,
    @Body() payload: UpdateArticleDto,
    @UploadedFile() file?: Express.Multer.File,

  ) {
    return {
      message: 'Update article',
      data: await this.articleService.findOneAndUpdateOne(
        { _id: articleId },
        payload,
        file
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
