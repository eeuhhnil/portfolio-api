import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ArticleDto, QueryArticleDto, UpdateArticleDto } from './dtos'
import { AuthUser } from '../auth/decorators'
import { AuthPayload } from '../auth/types'
import { ArticleService } from './article.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@Controller('articles')
@ApiTags('articles')
@ApiBearerAuth()

export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async createOne(@Body() payload: ArticleDto, @AuthUser() authUser: AuthPayload) {
    return{
      message: 'Create article',
      data: await this.articleService.createOne({
        author: authUser.sub,
        ... payload,
      }),
    }
  }

  @Get()
  async findAll(@Query() query: QueryArticleDto){
    return {
      message: 'Get all articles',
      data: await this.articleService.findAll(query)
    }
  }

  @Get(':articleId')
  async findOne(@Param('articleId') articleId: string){
    return {
      message: 'Get article witt Id',
      data: await this.articleService.findOne(articleId)
    }
  }

  @Patch(':articleId')
  async UpdateArticle(@Param('articleId') articleId: string, @Body() payload: UpdateArticleDto){
    return{
      message: 'Update article',
      data: await  this.articleService.findOneAndUpdateOne({_id: articleId}, payload)
    }
  }

  @Delete(':articleId')
  async remove(@Param('articleId') articleId: string){
    return {
      message: 'Delete article',
      data: await this.articleService.remove(articleId)
    }
  }

}
