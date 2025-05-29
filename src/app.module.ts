import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {DBModule} from "./modules/db/db.module";
import {UserModule} from "./modules/users/user.module";

@Module({
  imports: [ConfigModule.forRoot(), DBModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
