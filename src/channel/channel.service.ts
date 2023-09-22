import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ChannelService {
  constructor(private readonly prismaService: PrismaService) {}
  async create({ name, type, serverId }: CreateChannelDto, userId: string) {
    const server = await this.prismaService.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            userId,
            role: {
              not: 'GUEST',
            },
          },
        },
      },
    });
    if (!server)
      throw new ForbiddenException(
        'You do not have the necessary permissions to perform this action',
      );
    return await this.prismaService.channel.create({
      data: {
        name,
        type,
        userId,
        serverId,
      },
    });
  }

  findAll(userId: string) {
    return this.prismaService.channel.findMany({
      where: {
        server: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
        server: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    });
    if (!channel) throw new NotFoundException('Channel not found');
    return channel;
  }

  async update(id: string, { name, type }: UpdateChannelDto, userId: string) {
    const channel = await this.findOne(id, userId);
    return this.prismaService.channel.update({
      where: {
        id,
        userId,
      },
      data: {
        name: name || channel.name,
        type: type || channel.type,
      },
    });
  }

  async remove(id: string, userId: string) {
    let channel = await this.findOne(id, userId);
    if (channel.name === 'general')
      throw new BadRequestException('Can not delete the general channel');
    channel = await this.prismaService.channel.findFirst({
      where: {
        server: {
          members: {
            some: {
              userId,
              role: {
                not: 'GUEST',
              },
            },
          },
        },
      },
    });
    if (!channel)
      throw new ForbiddenException(
        'You do not have the necessary permissions to perform this action',
      );
    return this.prismaService.channel.delete({
      where: {
        id,
      },
    });
  }
}
