import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DBModule } from './modules/db/db.module'
import { UserModule } from './modules/users/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { JwtStrategy } from './modules/auth/strategies'
import { StorageModule } from './modules/storages/storage.module'
import { JwtAuthGuard } from './modules/auth/guards'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DBModule,
    UserModule,
    AuthModule,
    StorageModule,
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
