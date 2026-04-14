import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { GenerateWorkoutDto, AdjustWorkoutDto, GenerateSummaryDto, AiChatDto } from './dto';
import { UserRole } from '../users/entities/user.entity';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate-workout')
  @Roles(UserRole.COACH)
  async generateWorkout(@Body() dto: GenerateWorkoutDto) {
    return this.aiService.generateWorkout(dto);
  }

  @Post('adjust-workout')
  @Roles(UserRole.COACH)
  async adjustWorkout(@Body() dto: AdjustWorkoutDto) {
    return this.aiService.adjustWorkout(dto);
  }

  @Post('progress-summary')
  @Roles(UserRole.COACH)
  async generateSummary(@Body() dto: GenerateSummaryDto) {
    return this.aiService.generateSummary(dto);
  }

  @Post('chat')
  async chat(@Body() dto: AiChatDto) {
    const response = await this.aiService.chat(dto);
    return { message: response };
  }
}