import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { FindAllMessagesDto } from './dto/find-all-messages.dto';
import { ServerService } from '@/server/server.service';
import { SocketGateway } from '@/socket/socket.gateway';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { MemberRole } from '@prisma/client';

const MESSAGE_BATCH = 10;

@Injectable()
export class MessagesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly serverService: ServerService,
    private readonly socketGateway: SocketGateway,
  ) {}
  async create(
    { channelId, content, fileUrl, serverId }: CreateMessageDto,
    userId: string,
  ) {
    const server = await this.serverService.findOne(serverId, userId);
    const channel = server.channels.find((channel) => (channel.id = channelId));
    if (!channel) throw new NotFoundException('Channel not fount');
    const member = server.members.find((member) => member.userId === userId);
    const message = await this.prismaService.message.create({
      data: {
        content,
        channelId: channel.id,
        memberId: member.id,
        fileUrl,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });
    const channelKey = `chat:${channelId}:messages`;
    this.socketGateway.server.emit(channelKey, message);
    return message;
  }

  async findAll({ channelId, cursor }: FindAllMessagesDto, userId: string) {
    const commonQuery = {
      take: MESSAGE_BATCH,
      where: { channelId },
      include: { member: { include: { user: true } } },
      orderBy: { createAt: 'desc' },
    } as any;

    const messages = cursor
      ? await this.prismaService.message.findMany({
          cursor: { id: cursor },
          ...commonQuery,
        })
      : await this.prismaService.message.findMany({
          ...commonQuery,
        });

    let nextCursor = null;
    if (messages.length === MESSAGE_BATCH)
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    return {
      items: messages,
      nextCursor,
    };
  }

  async update(
    id: string,
    { channelId, content, serverId }: UpdateMessageDto,
    userId: string,
  ) {
    const server = await this.serverService.findOne(serverId, userId);
    const channel = server.channels.find((channel) => (channel.id = channelId));
    if (!channel) throw new NotFoundException('Channel not fount');
    const member = server.members.find((member) => member.userId === userId);
    const message = await this.prismaService.message.update({
      where: {
        id,
        channelId,
      },
      data: {
        content,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });
    const channelKey = `chat:${channelId}:messages:update`;
    this.socketGateway.server.emit(channelKey, message);
    return message;
  }

  async remove(
    id: string,
    { channelId, serverId }: DeleteMessageDto,
    userId: string,
  ) {
    const trigger = () => {
      const channelKey = `chat:${channelId}:messages:delete`;
      this.socketGateway.server.emit(channelKey, message);
    };
    const server = await this.serverService.findOne(serverId, userId);
    const channel = server.channels.find((channel) => (channel.id = channelId));
    if (!channel) throw new NotFoundException('Channel not fount');
    const member = server.members.find((member) => member.userId === userId);
    let message = await this.prismaService.message.findUnique({
      where: {
        id,
        channelId,
      },
    });
    if (!message) throw new NotFoundException('Message not found');
    if (member.role === MemberRole.ADMIN && message) {
      trigger();
      return await this.prismaService.message.delete({ where: { id } });
    }
    message = await this.prismaService.message.findUnique({
      where: {
        id,
        channelId,
        member: {
          userId,
        },
      },
    });
    if (message) {
      trigger();
      return await this.prismaService.message.delete({ where: { id } });
    }
    throw new ForbiddenException(
      'You do not have the necessary permissions to perform this action',
    );
  }
}
