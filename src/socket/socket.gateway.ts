import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@UsePipes(new ValidationPipe({ whitelist: true }))
@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Socket;

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected from host: ${client.conn.remoteAddress}`);
    console.log(`Client connected from host: ${client.handshake.address}`);
    console.log(
      `Connection established on port: ${client.handshake.headers.host}`,
    );
  }
}
