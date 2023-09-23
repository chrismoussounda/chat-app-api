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
import { ServerService } from './server.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { GetUser } from '@/user/user.decorator';
import { User } from '@prisma/client';
import { MemberServerDto } from './dto/member-server.dto';
import { UpdateMemberServerDto } from './dto/update-member-server.dto';

@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post()
  create(@Body() createServerDto: CreateServerDto, @GetUser() user: User) {
    return this.serverService.create(user.id, createServerDto);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.serverService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.serverService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServerDto: UpdateServerDto,
    @GetUser() user: User,
  ) {
    return this.serverService.update(id, updateServerDto, user.id);
  }

  @Patch(':id/invite-code')
  inviteCode(@Param('id') id: string, @GetUser() user: User) {
    return this.serverService.updateInviteCode(id, user.id);
  }

  @Patch(':id/member-role')
  updateMember(
    @Param('id') id: string,
    @Body() updateMemberServerDto: UpdateMemberServerDto,
    @GetUser() user: User,
  ) {
    return this.serverService.updateMemberRole(
      id,
      updateMemberServerDto,
      user.id,
    );
  }

  @Patch(':id/join')
  addMember(@Param('id') inviteCode: string, @GetUser() user: User) {
    return this.serverService.joinServer(inviteCode, user.id);
  }

  @Delete(':id/remove-member')
  removeMember(
    @Param('id') id: string,
    @Query() memberServerDto: MemberServerDto,
    @GetUser() user: User,
  ) {
    return this.serverService.removeMember(id, memberServerDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.serverService.remove(id, user.id);
  }

  @Delete(':id/leave')
  leave(@Param('id') id: string, @GetUser() user: User) {
    return this.serverService.leave(id, user.id);
  }
}
