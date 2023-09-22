import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { FindAllMessagesDto } from './dto/find-all-messages.dto';
import { GetUser } from '@/user/user.decorator';
import { User } from '@prisma/client';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @Get()
  findAll(@Query() params: FindAllMessagesDto, @GetUser() user: User) {
    return this.messagesService.findAll(params, user.id);
  }
  @Post()
  create(@Body() body: CreateMessageDto, @GetUser() user: User) {
    return this.messagesService.create(body, user.id);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateMessageDto,
    @GetUser() user: User,
  ) {
    return this.messagesService.update(id, body, user.id);
  }
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query() query: DeleteMessageDto,
    @GetUser() user: User,
  ) {
    return this.messagesService.remove(id, query, user.id);
  }
}
