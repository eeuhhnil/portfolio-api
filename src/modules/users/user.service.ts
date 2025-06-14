import { Injectable, NotFoundException } from '@nestjs/common'
import { User, UserDocument } from './schemas/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose'
import { QueryUserDTO } from './dtos'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: PaginateModel<UserDocument>,
  ) {}

  async create(payload: Omit<User, '_id'>) {
    return this.userModel.create(payload)
  }

  async getUserById(id: string) {
    return this.userModel.findById(id)
  }

  async findOne(
    filter: FilterQuery<User>,
    options: {
      select?: string | string[]
    } = {},
  ) {
    return this.userModel.findOne(filter).select(options.select || {})
  }

  async findManyUsers(query: QueryUserDTO) {
    const filter: FilterQuery<User> = {}
    if (query.role) filter.role = { $in: query.role }
    if (query.gender) filter.gender = query.gender
    if (query.search) {
      filter.$or = [{ fullName: { $regex: query.search, $options: 'i' } }]
    }

    const option: PaginateOptions = {
      page: query.page,
      limit: query.limit,
      sort: query.getSortObject(),
    }
    return this.userModel.paginate(filter, option)
  }

  async removeUser(id: string) {
    return this.userModel.deleteOne({ _id: id })
  }

  async updateUser(id: string, data: Partial<Omit<User, '_id'>>) {
    const user = await this.checkExisting({ _id: id })

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`)
    }

    const { hashedPassword, ...userInfo } = data

    return this.userModel.findOneAndUpdate(
      { _id: id },
      {
        hashedPassword: hashedPassword
          ? bcrypt.hashSync(hashedPassword, 10)
          : undefined,
        ...userInfo,
      },
      { new: true },
    )
  }

  async checkExisting(filter: FilterQuery<User>) {
    return this.userModel.exists(filter)
  }

  async checkExistingEmail(email: string) {
    return this.userModel.exists({ email })
  }
}
