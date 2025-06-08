import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';

@Injectable()
export class DbService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DbService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  onApplicationBootstrap(): any {
    try {
      if (this.connection.readyState === ConnectionStates.connected) {
        this.logger.log('Connected to DB');
      } else {
        this.logger.log('Failed to connect to DB');
      }
    } catch (error) {
      const err = error as Error;
      this.logger.log(`MongoDB connection error: ${err.message}\`, err.stack`);
    }
  }
}
