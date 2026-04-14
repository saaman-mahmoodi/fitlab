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
import { AutomationsService } from './automations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { CreateAutomationDto, UpdateAutomationDto } from './dto';
import { UserRole } from '../users/entities/user.entity';

@Controller('automations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.COACH)
export class AutomationsController {
  constructor(private automationsService: AutomationsService) {}

  @Get()
  async list(@CurrentUser('id') userId: string) {
    const coach = await this.automationsService.findByCoachId(userId);
    return coach;
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.automationsService.findById(id);
  }

  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateAutomationDto,
  ) {
    return this.automationsService.create(userId, dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAutomationDto,
  ) {
    return this.automationsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.automationsService.delete(id);
    return { message: 'Automation deleted' };
  }

  @Post(':id/toggle')
  async toggleActive(@Param('id', ParseUUIDPipe) id: string) {
    return this.automationsService.toggleActive(id);
  }
}