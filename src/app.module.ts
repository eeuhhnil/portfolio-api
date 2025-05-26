import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {DBModule} from "./modules/db/db.module";

@Module({
  imports: [ConfigModule.forRoot(), DBModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
