import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Service } from './schemas/service.schema'
import { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose'
import { CreateServiceDto, UpdateServiceDto, QueryServiceDto } from './dtos/service.dto'

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name)
    private readonly serviceModel: PaginateModel<Service>,
  ) {}

  async createOne(createServiceDto: CreateServiceDto) {
    return this.serviceModel.create(createServiceDto)
  }

  async findAll(query: QueryServiceDto) {
    const filter: FilterQuery<Service> = {}

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } }
      ]
    }

    if (query.category) {
      filter.category = query.category
    }

    if (query.isActive !== undefined) {
      filter.isActive = query.isActive
    }

    const options: PaginateOptions = {
      limit: query.limit,
      page: query.page,
      sort: query.getSortObject?.(),
      populate: [{ path: 'category', select: 'name description' }]
    }

    return this.serviceModel.paginate(filter, options)
  }

  async findOne(id: string) {
    const service = await this.serviceModel
      .findById(id)
      .populate('category', 'name description')
      .exec()

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`)
    }

    return service
  }

  async updateOne(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceModel
      .findByIdAndUpdate(id, updateServiceDto, { new: true })
      .populate('category', 'name description')
      .exec()

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`)
    }

    return service
  }

  async deleteOne(id: string) {
    const service = await this.serviceModel.findByIdAndDelete(id).exec()

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`)
    }

    return service
  }
}
