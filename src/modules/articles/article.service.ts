import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Article } from './schemas/article.schema'
import {
  FilterQuery,
  PaginateModel,
  PaginateOptions,
  QueryOptions,
} from 'mongoose'
import { QueryArticleDto, UpdateArticleDto } from './dtos'
import { StorageService } from '../storages/storage.service'
import * as path from 'node:path'

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: PaginateModel<Article>,
    private readonly storage: StorageService,
  ) {}

  async createOne(article: Omit<Article, '_id'>) {
    return this.articleModel.create(article)
  }

  async findAll(query: QueryArticleDto) {
    const filter: FilterQuery<Article> = {}
    if (query.search) {
      filter.$or = [{ name: { $regex: query.search, $options: 'i' } }]
    }

    const option: PaginateOptions = {
      limit: query.limit,
      page: query.page,
      sort: query.getSortObject?.(),
    }

    return this.articleModel.paginate(filter, option)
  }

  async findOne(id: string) {
    return this.articleModel.findById(id)
  }

  async findOneAndUpdateOne(
    filter: FilterQuery<Article>,
    payload: UpdateArticleDto,
    file?: Express.Multer.File,
  ) {
    const article = await this.articleModel.findOne(filter)
    if (!article) {
      throw new Error('article not found')
    }

    if (payload.removeImage || file) {
      if (article?.image) {
        await this.storage.deleteFile(
          this.storage.extractKeyFromUrl(article.image),
        )
      }
      article.image = undefined
    }

    let avatar: string | undefined
    if (file) {
      const processedAvatar = await this.storage.proccessAvatarFile(file)

      if (!processedAvatar || !processedAvatar.originalName) {
        throw new Error('Failed to process avatar file')
      }

      const fileExtension = path.extname(processedAvatar.originalName)
      avatar = await this.storage.uploadFile(
        `articles/${article._id}${fileExtension}`,
        processedAvatar,
      )
      article.image = avatar
    }

    Object.assign(article, payload)
    await article.save()
    return article
  }

  async remove(id: string) {
    return this.articleModel.deleteOne({ _id: id })
  }
}
