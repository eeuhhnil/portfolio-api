import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ServiceService } from './service.service'
import { CreateServiceDto, UpdateServiceDto, QueryServiceDto } from './dtos/service.dto'
import { Public } from '../auth/decorators'

@Controller('services')
@ApiTags('Services')
@ApiBearerAuth()
export class ServiceController {
  constructor(
    private readonly serviceService: ServiceService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createOne(@Body() createServiceDto: CreateServiceDto) {
    return {
      message: 'Create service successfully',
      data: await this.serviceService.createOne(createServiceDto),
    }
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all services with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Services retrieved successfully' })
  async findAll(@Query() query: QueryServiceDto) {
    return {
      message: 'Get all services',
      data: await this.serviceService.findAll(query),
    }
  }

  @Public()
  @Get(':serviceId')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiResponse({ status: 200, description: 'Service retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async findOne(@Param('serviceId') serviceId: string) {
    return {
      message: 'Get service by ID',
      data: await this.serviceService.findOne(serviceId),
    }
  }

  @Patch(':serviceId')
  @ApiOperation({ summary: 'Update service by ID' })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async updateOne(
    @Param('serviceId') serviceId: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return {
      message: 'Update service successfully',
      data: await this.serviceService.updateOne(serviceId, updateServiceDto),
    }
  }

  @Delete(':serviceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete service by ID' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async deleteOne(@Param('serviceId') serviceId: string) {
    return {
      message: 'Delete service successfully',
      data: await this.serviceService.deleteOne(serviceId),
    }
  }
}
