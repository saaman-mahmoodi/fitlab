import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { UpdateCoachDto } from './dto';
import { UserRole } from '../users/entities/user.entity';

@Controller('coaches')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.COACH)
export class CoachesController {
  constructor(private coachesService: CoachesService) {}

  @Get('me')
  async getMyProfile(@CurrentUser('id') userId: string) {
    return this.coachesService.findByUserId(userId);
  }

  @Put('me')
  async updateMyProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCoachDto,
  ) {
    return this.coachesService.update(userId, dto);
  }
}