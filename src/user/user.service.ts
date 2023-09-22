import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UpdateUserPassword } from './dto/update-user-password.dto';
const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async create({ name, password }: CreateUserDto) {
    const user = await this.findOneByName(name);
    if (user) throw new ConflictException('Username Already in use');
    const imageUrl = `https://ui-avatars.com/api/?background=random&name=${name}`;
    return await this.prismaService.user.create({
      data: {
        name,
        imageUrl,
        password: await this.hashPassword(password),
      },
    });
  }

  async valideToken(content: string) {
    const token = await this.prismaService.token.findUnique({
      where: {
        content,
      },
    });
    return !!token;
  }

  async addToken(id: string, content: string, time: number) {
    const expireAt = new Date();
    expireAt.setMilliseconds(expireAt.getMilliseconds() + time);
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        tokens: {
          create: {
            content,
            expireAt,
          },
        },
      },
    });
  }

  async removeToken(content: string) {
    return this.prismaService.token.deleteMany({
      where: {
        content,
      },
    });
  }

  cleanTokens() {
    return this.prismaService.token.deleteMany({
      where: {
        expireAt: {
          lte: new Date(),
        },
      },
    });
  }

  async hashPassword(password: string) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return salt + '.' + hash.toString('hex');
  }

  async checkPassword(hashedPassword: string, password: string) {
    const [salt, hash] = hashedPassword.split('.');
    const newHash = (await scrypt(password, salt, 32)) as Buffer;
    return hash === newHash.toString('hex');
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findOneOrFail(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneByName(name: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        name,
      },
    });
    return user;
  }

  update(id: string, { name }: UpdateUserDto) {
    const imageUrl = `https://ui-avatars.com/api/?background=random&name=${name}`;
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        name,
        imageUrl,
      },
    });
  }

  async updatePassword(
    id: string,
    { newPassword, password }: UpdateUserPassword,
  ) {
    const user = await this.findOneOrFail(id);
    const match = await this.checkPassword(user.password, password);
    if (!match) throw new BadRequestException('Wrong Password');
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        password: await this.hashPassword(newPassword),
      },
    });
  }

  async remove(id: string) {
    await this.findOneOrFail(id);
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
