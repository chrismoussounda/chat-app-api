import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { GetUser } from '@/user/user.decorator';
import { User } from '@prisma/client';
import { ServerChannelDto } from './dto/server-channel.dto';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto, @GetUser() user: User) {
    return this.channelService.create(createChannelDto, user.id);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.channelService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.channelService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
    @GetUser() user: User,
  ) {
    return this.channelService.update(id, updateChannelDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.channelService.remove(id, user.id);
  }
}
