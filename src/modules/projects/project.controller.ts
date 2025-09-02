import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { ProjectService } from './project.service'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import {
  ProjectDto,
  QueryProjectDto,
  UpdateProjectDto,
} from './dtos'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('projects')
@ApiBearerAuth()
@ApiTags('Projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createOne(@Body() payload: ProjectDto) {
    return {
      message: 'Create project successfully',
      data: await this.projectService.createOne(payload),
    }
  }

  @Get(':projectId')
  async findOneById(@Param('projectId') projectId: string) {
    return {
      message: 'Get project by id successfully',
      data: await this.projectService.findOneById(projectId),
    }
  }

  @Get()
  async findMany(@Query() query: QueryProjectDto) {
    return {
      message: 'Get all projects successfully',
      data: await this.projectService.findMany(query),
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
        githubLink: {
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
  @Patch(':projectId')
  async findOneAndUpdate(
    @Param('projectId') projectId: string,
    @Body() payload: UpdateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return {
      message: 'Update project successfully',
      data: await this.projectService.findOneAndUpdate(
        { _id: projectId },
        payload,
        file,
      ),
    }
  }

  @Delete(':projectId')
  async deleteOne(@Param('projectId') projectId: string) {
    return {
      message: 'Delete project successfully',
      data: await this.projectService.deleteOne(projectId),
    }
  }
}
