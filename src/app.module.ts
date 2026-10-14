import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildLogsGateway } from './build-logs.gateway';
import { BuildLogsService } from './build-logs.service';
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, BuildLogsService, BuildLogsGateway],
})
export class AppModule {}