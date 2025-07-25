import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Article } from './schemas/article.schema'
import { FilterQuery, PaginateModel, PaginateOptions, QueryOptions } from 'mongoose'
import { QueryArticleDto } from './dtos'

@Injectable()
export class ArticleService{
  constructor(
    @InjectModel(Article.name) private readonly articleModel: PaginateModel<Article>
  ){}

  async createOne(article: Omit<Article, '_id'>){
    return this.articleModel.create(article)
  }

  async findAll(query: QueryArticleDto){
    const filter: FilterQuery<Article>= {}
    if(query.search){
      filter.$or = [{name: {$regex: query.search, $options: 'i'}}]
    }

    const option: PaginateOptions = {
      limit: query.limit,
      page: query.page,
      sort: query.getSortObject?.()
    }

    return this.articleModel.paginate(filter, option)
  }

  async findOne(id: string){
    return this.articleModel.findById(id)
  }

  async findOneAndUpdateOne(filter: FilterQuery<Article>, data : Partial<Omit<Article, '_id'>>){
    return this.articleModel.findOneAndUpdate(filter, data, {new: true})
  }

  async remove(id: string){
    return this.articleModel.deleteOne({ _id: id })
  }

}