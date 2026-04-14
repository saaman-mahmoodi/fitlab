import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { CreateGroupDto, UpdateGroupDto, AddMembersDto, RemoveMembersDto } from './dto';
import { UserRole } from '../users/entities/user.entity';

@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.COACH)
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get()
  async list(@CurrentUser('id') userId: string) {
    return this.groupsService.findByCoachId(userId);
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.groupsService.findById(id);
  }

  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateGroupDto) {
    return this.groupsService.create(userId, dto);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateGroupDto) {
    return this.groupsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.groupsService.delete(id);
    return { message: 'Group deleted' };
  }

  @Post(':id/members')
  async addMembers(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AddMembersDto) {
    return this.groupsService.addMembers(id, dto);
  }

  @Post(':id/members/remove')
  async removeMembers(@Param('id', ParseUUIDPipe) id: string, @Body() dto: RemoveMembersDto) {
    return this.groupsService.removeMembers(id, dto);
  }
}