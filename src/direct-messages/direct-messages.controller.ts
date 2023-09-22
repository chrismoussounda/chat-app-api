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
import { DirectMessagesService } from './direct-messages.service';
import { CreateDirectMessageDto } from './dto/create-direct-message.dto';
import { UpdateDirectMessageDto } from './dto/update-direct-message.dto';
import { GetUser } from '@/user/user.decorator';
import { User } from '@prisma/client';
import { FindAllDirectMessagesDto } from './dto/find-all-direct-messages.dto';
import { FindOneDirectMessageDto } from './dto/find-one-message.dto';

@Controller('direct-messages')
export class DirectMessagesController {
  constructor(private readonly directMessagesService: DirectMessagesService) {}

  @Post()
  create(
    @Body() createDirectMessageDto: CreateDirectMessageDto,
    @GetUser() user: User,
  ) {
    return this.directMessagesService.create(createDirectMessageDto, user.id);
  }

  @Get()
  findAll(@Query() query: FindAllDirectMessagesDto, @GetUser() user: User) {
    return this.directMessagesService.findAll(query, user.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query() query: FindOneDirectMessageDto,
    @GetUser() user: User,
  ) {
    return this.directMessagesService.findOne(id, query, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDirectMessageDto: UpdateDirectMessageDto,
    @GetUser() user: User,
  ) {
    return this.directMessagesService.update(
      id,
      updateDirectMessageDto,
      user.id,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query() query: FindOneDirectMessageDto,
    @GetUser() user: User,
  ) {
    return this.directMessagesService.remove(id, query, user.id);
  }
}
