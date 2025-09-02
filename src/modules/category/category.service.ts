import { InjectModel } from '@nestjs/mongoose'
import { Category } from './schemas/category.schema'
import { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { QueryCategoryDto, UpdateCategoryDto } from './dtos/category.dto'

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: PaginateModel<Category>,
  ) {}

  async createOne(category: Omit<Category, '_id'>) {
    return this.categoryModel.create(category)
  }

  async findMany(query: QueryCategoryDto) {
    const filter: FilterQuery<Category> = {}
    if (query.search) {
      filter.$or = [{ name: { $regex: query.search, $options: 'i' } }]
    }
    const option: PaginateOptions = {
      limit: query.limit,
      page: query.page,
      sort: query.getSortObject?.(),
    }
    return this.categoryModel.paginate(filter, option)
  }

  async findOneById(id: string) {
    return this.categoryModel.findById(id)
  }

  async deleteOne(filter: FilterQuery<Category>) {
    return this.categoryModel.deleteOne(filter)
  }

  async findOneAndUpdate(
    filter: FilterQuery<Category>,
    payload: UpdateCategoryDto
  ) {
    return this.categoryModel.findOneAndUpdate(filter, payload, { new: true })
  }
}
