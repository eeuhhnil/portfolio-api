import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { BookingStatus } from '../enums/booking-status.enum'

export type BookingDocument = HydratedDocument<Booking>

@Schema({
  timestamps: true,
})
export class Booking {
  @Prop({ type: String, required: true })
  fullName: string

  @Prop({ type: String, required: true })
  email: string

  @Prop({ type: String, required: true })
  phone: string

  @Prop({ type: String, required: true })
  message: string

  @Prop({ type: String, required: false })
  description?: string

  @Prop({ type: String, ref: 'Service', required: false })
  service?: string

  @Prop({
    type: String,
    enum: BookingStatus,
    required: false,
    default: BookingStatus.PENDING,
  })
  status?: BookingStatus

  @Prop({ type: Date, required: false })
  preferredDate?: Date

  @Prop({ type: String, required: false })
  notes?: string
}

export const BookingSchema = SchemaFactory.createForClass(Booking)
BookingSchema.plugin(paginate)
