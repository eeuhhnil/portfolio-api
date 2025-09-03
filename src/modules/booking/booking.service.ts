import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose'
import { Booking } from './schemas/booking.schema'
import { QueryBookingDto, UpdateBookingDto } from './dtos'
import { BookingStatus } from './enums/booking-status.enum'

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: PaginateModel<Booking>,
  ) {}

  async createOne(booking: Omit<Booking, '_id'>) {
    return this.bookingModel.create(booking)
  }

  async findAll(query: QueryBookingDto) {
    const filter: FilterQuery<Booking> = {}

    // Search functionality
    if (query.search) {
      filter.$or = [
        { fullName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { message: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ]
    }

    // Filter by status
    if (query.status) {
      filter.status = query.status
    }

    // Filter by service
    if (query.service) {
      filter.service = query.service
    }

    const options: PaginateOptions = {
      limit: query.limit,
      page: query.page,
      sort: query.getSortObject?.(),
      populate: [
        {
          path: 'service',
          select: 'title description price category',
        },
      ],
    }

    return this.bookingModel.paginate(filter, options)
  }

  async findOne(id: string) {
    const booking = await this.bookingModel
      .findById(id)
      .populate('service', 'title description price category')

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`)
    }

    return booking
  }

  async updateOne(id: string, updateData: UpdateBookingDto) {
    const booking = await this.bookingModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('service', 'title description price category')

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`)
    }

    return booking
  }

  async deleteOne(id: string) {
    const booking = await this.bookingModel.findByIdAndDelete(id)

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`)
    }

    return booking
  }

  async updateStatus(id: string, status: BookingStatus) {
    return this.updateOne(id, { status })
  }

  async findByEmail(email: string) {
    return this.bookingModel.find({ email }).populate('service')
  }

  async findByService(serviceId: string, query?: QueryBookingDto) {
    const filter: FilterQuery<Booking> = { service: serviceId }

    if (query?.status) {
      filter.status = query.status
    }

    const options: PaginateOptions = {
      limit: query?.limit || 10,
      page: query?.page || 1,
      sort: query?.getSortObject?.() || { createdAt: -1 },
    }

    return this.bookingModel.paginate(filter, options)
  }

  async getBookingStats() {
    const stats = await this.bookingModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ])

    const totalBookings = await this.bookingModel.countDocuments()

    return {
      totalBookings,
      statusBreakdown: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count
        return acc
      }, {}),
    }
  }
}