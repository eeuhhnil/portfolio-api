import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DBModule } from './modules/db/db.module'
import { UserModule } from './modules/users/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { StorageModule } from './modules/storages/storage.module'
import { JwtAuthGuard } from './modules/auth/guards'
import { TagModule } from './modules/tags/tag.module'
import { ArticleModule } from './modules/articles/article.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DBModule,
    UserModule,
    AuthModule,
    StorageModule,
    TagModule,
    ArticleModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
