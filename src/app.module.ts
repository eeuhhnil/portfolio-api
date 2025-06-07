import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {DBModule} from "./modules/db/db.module";
import {UserModule} from "./modules/users/user.module";
import {AuthModule} from "./modules/auth/auth.module";

@Module({
  imports: [ConfigModule.forRoot(), DBModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
