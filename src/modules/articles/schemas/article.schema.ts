import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { HydratedDocument } from 'mongoose'

export type ArticleDocument = HydratedDocument<Article>


@Schema({
  timestamps: true
})

export class Article {
  @Prop({type: String, required: true, unique: true})
  title: string

  @Prop({type: String, required: true})
  slug: string

  @Prop({type: String, required: false})
  description?: string

  @Prop({type: String, required: true})
  content: string

  @Prop({type: String, ref: 'User',  required: true})
  author: string

  @Prop({type: [String], required: false})
  tags?: string[]

  @Prop()
  image? : string
}

export const ArticleSchema = SchemaFactory.createForClass(Article)
ArticleSchema.plugin(paginate)
