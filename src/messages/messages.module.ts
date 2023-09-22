import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { SocketModule } from '@/socket/socket.module';
import { ServerModule } from '@/server/server.module';

@Module({
  imports: [PrismaModule, SocketModule, ServerModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
