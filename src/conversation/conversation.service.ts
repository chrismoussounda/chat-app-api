import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private readonly prismaService: PrismaService) {}
  create({ memberOneId, memberTwoId }: CreateConversationDto) {
    return this.prismaService.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            user: true,
          },
        },
        memberTwo: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findOne(
    { memberOneId, memberTwoId }: CreateConversationDto,
    userId: string,
  ) {
    const conversation = await this.prismaService.conversation.findFirst({
      where: {
        memberOne: {
          id: {
            in: [memberOneId, memberTwoId],
          },
        },
        memberTwo: {
          id: {
            in: [memberOneId, memberTwoId],
          },
        },
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
      include: {
        memberOne: {
          include: {
            user: true,
          },
        },
        memberTwo: {
          include: {
            user: true,
          },
        },
      },
    });
    if (conversation) return conversation;
    return this.create({ memberOneId, memberTwoId });
  }

  remove(id: string, userId: string) {
    return this.prismaService.conversation.delete({
      where: {
        id,
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
    });
  }
}
