import { Injectable } from '@nestjs/common'
import { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Tag } from './schemas/tag.schema'
import { QueryTagDto } from './dtos/tag.dto'

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: PaginateModel<Tag>
  ) {
  }

  async createTag(tag: Omit<Tag, '_id'>){
    return this.tagModel.create(tag)
  }

  async findManyTasks(query: QueryTagDto){
    const filter: FilterQuery<Tag> = {}
    if(query.search){
      filter.$or = [{name: {$regex: query.search, $options: 'i'}}]
    }

    const option: PaginateOptions = {
      limit: query.limit,
      page: query.page,
      sort: query.getSortObject?.()
    }

    return this.tagModel.paginate(filter, option)
  }

  async findOne(id: string){
    return this.tagModel.findById(id)
  }

  async deleteOne(filter: FilterQuery<Tag>){
    return this.tagModel.deleteOne(filter)
  }

  async findOneAndUpdate(filter: FilterQuery<Tag>, data: Partial<Omit<Tag, '_id'>>){
    return this.tagModel.findOneAndUpdate(filter, data)
  }
}