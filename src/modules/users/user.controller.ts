import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { UserService } from './user.service'
import { QueryUserDTO, UpdateUserDto } from './dtos'
import { FileInterceptor } from '@nestjs/platform-express'
import { StorageService } from '../storages/storage.service'
import * as path from 'node:path'
import { UserGender, UserRole } from './enums'

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly storage: StorageService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  async findUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return {
      message: 'Get user by id successfully',
      data: user.toJSON(),
    }
  }

  @Get('email/:email')
  async findOne(@Param('email') email: string) {
    return {
      data: await this.userService.findOne({ email }),
    }
  }

  @Get()
  @ApiOperation({ summary: 'Find many users' })
  async findMany(@Query() query: QueryUserDTO) {
    return {
      message: 'Get users successfully',
      data: await this.userService.findManyUsers(query),
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  async deleteUser(@Param('id') id: string) {
    return {
      message: 'Delete user',
      data: await this.userService.removeUser(id),
    }
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
        },
        hashedPassword: {
          type: 'string',
        },
        fullName: {
          type: 'string',
        },
        role: {
          type: 'string',
          enum: Object.values(UserRole),
        },
        gender: {
          type: 'string',
          enum: Object.values(UserGender),
        },
        file: {
          type: 'string',
          format: 'binary',
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
  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let avatar: string | undefined
    if (file) {
      const processedAvatar = await this.storage.proccessAvatarFile(file)
      const fileExtension = path.extname(processedAvatar.originalname)
      avatar = await this.storage.uploadFile(
        `users/${id}${fileExtension}`,
        processedAvatar,
      )
    }

    updateUserDto['avatar'] = avatar

    return {
      message: 'Update user',
      data: await this.userService.updateUser(id, updateUserDto),
    }
  }
}
