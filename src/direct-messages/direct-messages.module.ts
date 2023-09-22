import { Module } from '@nestjs/common';
import { DirectMessagesService } from './direct-messages.service';
import { DirectMessagesController } from './direct-messages.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { SocketModule } from '@/socket/socket.module';
@Module({
  imports: [PrismaModule, SocketModule],
  controllers: [DirectMessagesController],
  providers: [DirectMessagesService],
})
export class DirectMessagesModule {}
