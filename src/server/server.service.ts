import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { v4 as uuidV4 } from 'uuid';
import { MemberRole } from '@prisma/client';
import { MemberServerDto } from './dto/member-server.dto';
import { UpdateMemberServerDto } from './dto/update-member-server.dto';

@Injectable()
export class ServerService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(id: string, { imageUrl, name }: CreateServerDto) {
    return await this.prismaService.server.create({
      data: {
        userId: id,
        imageUrl,
        name,
        inviteCode: uuidV4(),
        channels: { create: { name: 'general', userId: id } },
        members: { create: { role: MemberRole.ADMIN, userId: id } },
      },
      include: {
        channels: true,
      },
    });
  }

  async findAll(id: string) {
    return this.prismaService.server.findMany({
      where: {
        members: {
          some: {
            userId: id,
          },
        },
      },
      orderBy: {
        createAt: 'asc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const server = await this.prismaService.server.findUnique({
      where: {
        id,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
          orderBy: { role: 'asc' },
        },
        channels: {
          include: {
            user: true,
          },
          orderBy: { createAt: 'asc' },
        },
      },
    });
    if (!server) throw new NotFoundException('Server not found');
    return server;
  }

  async update(
    id: string,
    { imageUrl, name }: UpdateServerDto,
    userId: string,
  ) {
    const server = await this.findOne(id, userId);
    return this.prismaService.server.update({
      where: {
        id,
        userId,
      },
      data: {
        name: name || server.name,
        imageUrl: imageUrl || server.imageUrl,
      },
    });
  }

  async joinServer(inviteCode: string, userId: string) {
    const server = await this.prismaService.server.findFirst({
      where: {
        inviteCode,
        members: {
          none: {
            userId: userId,
          },
        },
      },
      include: {
        channels: {
          orderBy: {
            createAt: 'asc',
          },
        },
      },
    });
    if (!server)
      throw new ConflictException('You are already a member of that server');
    await this.prismaService.member.create({
      data: {
        userId,
        serverId: server.id,
      },
    });
    await this.deleteDuplicateMembers(userId, server.id);
    return server;
  }

  async removeMember(
    id: string,
    { memberId }: MemberServerDto,
    userId: string,
  ) {
    await this.findOne(id, userId);
    return this.prismaService.server.update({
      where: {
        id,
        userId,
        members: {
          some: {
            id: memberId,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            userId: {
              not: userId,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async updateMemberRole(
    id: string,
    { memberId, role }: UpdateMemberServerDto,
    userId: string,
  ) {
    await this.findOne(id, userId);
    return this.prismaService.server.update({
      where: {
        id,
        userId,
        members: {
          some: {
            id: memberId,
          },
        },
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              userId: {
                not: userId,
              },
            },
            data: {
              role: role,
            },
          },
        },
      },
    });
  }

  async updateInviteCode(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prismaService.server.update({
      where: {
        id,
        userId,
      },
      data: {
        inviteCode: uuidV4(),
      },
    });
  }

  async leave(id: string, userId: string) {
    await this.findOne(id, userId);
    const member = await this.prismaService.member.findFirst({
      where: {
        userId,
        server: {
          id,
          userId: {
            not: userId,
          },
        },
      },
    });
    if (!member)
      throw new ForbiddenException(
        'You do not have the necessary permissions to perform this action',
      );
    return this.prismaService.member.delete({
      where: {
        id: member.id,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prismaService.server.delete({
      where: {
        id,
        userId,
      },
    });
  }

  async deleteDuplicateMembers(userId: string, serverId: string) {
    // Find all members with the given userId and serverId
    const members = await this.prismaService.member.findMany({
      where: {
        userId,
        serverId,
      },
    });

    // If there are more than one members, delete all but one of them
    if (members.length > 1) {
      for (let i = 1; i < members.length; i++) {
        await this.prismaService.member.delete({
          where: {
            id: members[i].id,
          },
        });
      }
    }
  }
}
