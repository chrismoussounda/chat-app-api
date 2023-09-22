import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ServerModule } from './server/server.module';
import { ChannelModule } from './channel/channel.module';
import { MessagesModule } from './messages/messages.module';
import { DirectMessagesModule } from './direct-messages/direct-messages.module';
import { LivekitModule } from './livekit/livekit.module';
import { SocketModule } from './socket/socket.module';
import { ConversationModule } from './conversation/conversation.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PrismaModule,
    AuthModule,
    ServerModule,
    ChannelModule,
    MessagesModule,
    DirectMessagesModule,
    LivekitModule,
    SocketModule,
    ConversationModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
