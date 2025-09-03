import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { HydratedDocument } from 'mongoose'

export type ServiceDocument = HydratedDocument<Service>

@Schema({
  timestamps: true,
})
export class Service {
  @Prop({ type: String, required: true })
  title: string

  @Prop({ type: String, required: false })
  description?: string

  @Prop({ type: String, ref: 'Category', required: true })
  category: string

  @Prop({ type: String, required: false })
  icon?: string

  @Prop({ type: Number, required: false, default: 0 })
  price?: number

  @Prop({ type: Boolean, required: false, default: true })
  isActive?: boolean
}

export const ServiceSchema = SchemaFactory.createForClass(Service)
ServiceSchema.plugin(paginate)
