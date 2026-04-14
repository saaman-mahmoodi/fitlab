import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import {
  CreateWorkoutDto,
  UpdateWorkoutDto,
  AddWorkoutSetDto,
  UpdateWorkoutSetDto,
} from './dto';
import { PaginationDto } from '../../common/dto';
import { UserRole } from '../users/entities/user.entity';
import { CoachesService } from '../coaches/coaches.service';

@Controller('workouts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkoutsController {
  constructor(
    private workoutsService: WorkoutsService,
    private coachesService: CoachesService,
  ) {}

  @Get()
  @Roles(UserRole.COACH)
  async listByCoach(
    @CurrentUser('id') userId: string,
    @Query('clientId') clientId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.workoutsService.findByClientId(clientId, pagination);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.workoutsService.findById(id);
  }

  @Post()
  @Roles(UserRole.COACH)
  async create(@Body() dto: CreateWorkoutDto) {
    return this.workoutsService.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.COACH)
  async update(@Param('id') id: string, @Body() dto: UpdateWorkoutDto) {
    return this.workoutsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.COACH)
  async remove(@Param('id') id: string) {
    await this.workoutsService.remove(id);
    return { message: 'Workout deleted' };
  }

  @Post(':id/sets')
  @Roles(UserRole.COACH)
  async addSet(@Param('id') id: string, @Body() dto: AddWorkoutSetDto) {
    return this.workoutsService.addSet(id, dto);
  }

  @Put('sets/:setId')
  @Roles(UserRole.COACH, UserRole.CLIENT)
  async updateSet(@Param('setId') setId: string, @Body() dto: UpdateWorkoutSetDto) {
    return this.workoutsService.updateSet(setId, dto);
  }

  @Delete('sets/:setId')
  @Roles(UserRole.COACH)
  async removeSet(@Param('setId') setId: string) {
    await this.workoutsService.removeSet(setId);
    return { message: 'Set removed' };
  }
}