import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDirectMessageDto } from './dto/create-direct-message.dto';
import { UpdateDirectMessageDto } from './dto/update-direct-message.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { SocketGateway } from '@/socket/socket.gateway';
import { FindAllDirectMessagesDto } from './dto/find-all-direct-messages.dto';
import { FindOneDirectMessageDto } from './dto/find-one-message.dto';

const MESSAGE_BATCH = 10;

@Injectable()
export class DirectMessagesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly socketGateway: SocketGateway,
  ) {}
  async create(
    { content, conversationId, fileUrl, memberId }: CreateDirectMessageDto,
    userId: string,
  ) {
    const conversation = await this.prismaService.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          {
            memberOne: {
              id: memberId,
              userId: userId,
            },
          },
          {
            memberTwo: {
              id: memberId,
              userId: userId,
            },
          },
        ],
      },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    const message = await this.prismaService.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId,
        memberId,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });
    const conversationKey = `chat:${conversationId}:messages`;
    this.socketGateway.server.emit(conversationKey, message);
    return message;
  }

  async findAll(
    { conversationId, cursor }: FindAllDirectMessagesDto,
    userId: string,
  ) {
    const commonQuery = {
      take: MESSAGE_BATCH,
      where: {
        conversation: {
          id: conversationId,
          OR: [
            {
              memberOne: {
                userId,
              },
            },
            {
              memberTwo: {
                userId,
              },
            },
          ],
        },
      },
      include: { member: { include: { user: true } } },
      orderBy: { createAt: 'desc' },
    } as any;
    const messages = cursor
      ? await this.prismaService.directMessage.findMany({
          cursor: { id: cursor },
          ...commonQuery,
        })
      : await this.prismaService.directMessage.findMany({
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

  async findOne(
    id: string,
    { conversationId, memberId }: FindOneDirectMessageDto,
    userId: string,
  ) {
    let message = await this.prismaService.directMessage.findUnique({
      where: {
        id,
        conversation: {
          id: conversationId,
          OR: [
            {
              memberOne: {
                id: memberId,
                userId,
              },
            },
            {
              memberTwo: {
                id: memberId,
                userId,
              },
            },
          ],
        },
      },
    });
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async update(
    id: string,
    { content, conversationId, memberId }: UpdateDirectMessageDto,
    userId: string,
  ) {
    await this.findOne(id, { conversationId, memberId }, userId);
    const message = await this.prismaService.directMessage.update({
      where: {
        id,
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
    const conversationKey = `chat:${conversationId}:messages:update`;
    this.socketGateway.server.emit(conversationKey, message);
    return message;
  }

  async remove(
    id: string,
    { conversationId, memberId }: FindOneDirectMessageDto,
    userId: string,
  ) {
    await this.findOne(id, { conversationId, memberId }, userId);
    const message = await this.prismaService.directMessage.delete({
      where: {
        id,
        memberId,
      },
    });
    const conversationKey = `chat:${conversationId}:messages:delete`;
    this.socketGateway.server.emit(conversationKey, message);
    return message;
  }
}
