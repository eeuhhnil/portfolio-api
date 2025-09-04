import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Project } from './schemas/project.schema'
import { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose'
import { QueryProjectDto, UpdateProjectDto } from './dtos'
import { StorageService } from '../storages/storage.service'
import * as path from 'node:path'

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: PaginateModel<Project>,
    private readonly storage: StorageService,
  ) {}

  async createOne(project: Omit<Project, '_id'>) {
    return this.projectModel.create(project)
  }

  async findMany(query: QueryProjectDto) {
    const filter: FilterQuery<Project> = {}
    if (query.search) {
      filter.$or = [{ name: { $regex: query.search, $options: 'i' } }]
    }

    const option: PaginateOptions = {
      limit: query.limit,
      page: query.page,
      sort: query.getSortObject?.(),
    }

    return this.projectModel.paginate(filter, option)
  }

  async findOneById(id: string) {
    return this.projectModel.findById(id)
  }

  async findOneAndUpdate(
    filter: FilterQuery<Project>,
    payload: UpdateProjectDto,
    file?: Express.Multer.File,
  ) {
    const project = await this.projectModel.findOne(filter)
    if (!project) {
      throw new Error('Project not found')
    }

    if (payload.removeImage || file) {
      if (project?.image) {
        await this.storage.deleteFile(
          this.storage.extractKeyFromUrl(project.image),
        )
      }
      project.image = undefined
    }

    let avatar: string | undefined
    if (file) {
      const processedAvatar = await this.storage.proccessAvatarFile(file)
      const fileExtension = path.extname(processedAvatar.originalName)
      avatar = await this.storage.uploadFile(
        `projects/${project._id}${fileExtension}`,
        processedAvatar,
      )
      project.image = avatar
    }

    Object.assign(project, payload)
    return project.save()
  }

  async deleteOne(id: string) {
    return this.projectModel.deleteOne({ _id: id })
  }
}
