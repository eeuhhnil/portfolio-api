import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { HydratedDocument } from 'mongoose'

export type ProjectDocument = HydratedDocument<Project>

@Schema({
  timestamps: true,
})
export class Project {
  @Prop({ type: String, required: true, unique: true })
  name: string

  @Prop({ type: String })
  title: string

  @Prop({ type: String })
  description: string

  @Prop({ type: String })
  githubLink: string

  @Prop({ type: String })
  image?: string
}

export const ProjectSchema = SchemaFactory.createForClass(Project)
ProjectSchema.plugin(paginate)
