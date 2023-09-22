import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@UsePipes(new ValidationPipe({ whitelist: true }))
@WebSocketGateway(8000, { cors: true })
export class SocketGateway {
  @WebSocketServer()
  server: Socket;
}
