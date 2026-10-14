import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BuildLogEvent, BuildLogsService } from './build-logs.service';

@WebSocketGateway({ namespace: 'build-logs', cors: true })
export class BuildLogsGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly buildLogsService: BuildLogsService) {}

  @SubscribeMessage('start')
  handleStart(@ConnectedSocket() client: Socket): void {
    this.buildLogsService.start((event: BuildLogEvent) => {
      this.server.to(client.id).emit('log', event);
    });
  }
}
