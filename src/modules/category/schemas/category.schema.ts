import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { HydratedDocument } from 'mongoose'

export type CategoryDocument = HydratedDocument<Category>

@Schema({
  timestamps: true,
})
export class Category {
  @Prop({ type: String, required: true, unique: true })
  name: string

  @Prop({ type: String, required: false })
  description: string
}

export const CategorySchema = SchemaFactory.createForClass(Category)
CategorySchema.plugin(paginate)
