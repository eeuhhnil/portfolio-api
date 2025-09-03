import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BookingService } from './booking.service'
import { BookingDto, QueryBookingDto, UpdateBookingDto } from './dtos'
import { BookingStatus } from './enums/booking-status.enum'
import { Public } from '../auth/decorators'

@Controller('bookings')
@ApiTags('Bookings')
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  async createOne(@Body() payload: BookingDto) {
    const bookingData = {
      ...payload,
      preferredDate: payload.preferredDate ? new Date(payload.preferredDate) : undefined,
    }

    return {
      message: 'Booking created successfully',
      data: await this.bookingService.createOne(bookingData),
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings with pagination and filters' })
  async findAll(@Query() query: QueryBookingDto) {
    return {
      message: 'Get all bookings successfully',
      data: await this.bookingService.findAll(query),
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get booking statistics' })
  async getStats() {
    return {
      message: 'Get booking statistics successfully',
      data: await this.bookingService.getBookingStats(),
    }
  }

  @Get(':bookingId')
  @ApiOperation({ summary: 'Get a booking by ID' })
  async findOne(@Param('bookingId') bookingId: string) {
    return {
      message: 'Get booking by ID successfully',
      data: await this.bookingService.findOne(bookingId),
    }
  }

  @Patch(':bookingId')
  @ApiOperation({ summary: 'Update a booking by ID' })
  async updateOne(
    @Param('bookingId') bookingId: string,
    @Body() payload: UpdateBookingDto,
  ) {
    return {
      message: 'Update booking successfully',
      data: await this.bookingService.updateOne(bookingId, payload),
    }
  }

  @Patch(':bookingId/status')
  @ApiOperation({ summary: 'Update booking status' })
  async updateStatus(
    @Param('bookingId') bookingId: string,
    @Body() payload: { status: BookingStatus },
  ) {
    return {
      message: 'Update booking status successfully',
      data: await this.bookingService.updateStatus(bookingId, payload.status),
    }
  }

  @Delete(':bookingId')
  @ApiOperation({ summary: 'Delete a booking by ID' })
  async deleteOne(@Param('bookingId') bookingId: string) {
    return {
      message: 'Delete booking successfully',
      data: await this.bookingService.deleteOne(bookingId),
    }
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get bookings by email address' })
  async findByEmail(@Param('email') email: string) {
    return {
      message: 'Get bookings by email successfully',
      data: await this.bookingService.findByEmail(email),
    }
  }

  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Get bookings by service ID' })
  async findByService(
    @Param('serviceId') serviceId: string,
    @Query() query: QueryBookingDto,
  ) {
    return {
      message: 'Get bookings by service successfully',
      data: await this.bookingService.findByService(serviceId, query),
    }
  }
}