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
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto';
import { UserRole } from '../users/entities/user.entity';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get('me')
  async getMySubscription(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.findByUserId(userId);
  }

  @Post()
  @Roles(UserRole.COACH)
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.create(userId, dto);
  }

  @Put(':id')
  @Roles(UserRole.COACH)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, dto);
  }

  @Delete('me')
  @Roles(UserRole.COACH)
  async cancel(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.cancel(userId);
  }
}