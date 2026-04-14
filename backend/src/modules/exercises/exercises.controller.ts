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
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { CreateExerciseDto, UpdateExerciseDto } from './dto';
import { PaginationDto } from '../../common/dto';
import { UserRole } from '../users/entities/user.entity';
import { ExerciseCategory, Equipment } from './entities/exercise.entity';

@Controller('exercises')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExercisesController {
  constructor(private exercisesService: ExercisesService) {}

  @Get()
  async list(
    @Query() pagination: PaginationDto,
    @Query('category') category?: ExerciseCategory,
    @Query('equipment') equipment?: Equipment,
  ) {
    return this.exercisesService.findAll(pagination, category, equipment);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.exercisesService.findById(id);
  }

  @Post()
  @Roles(UserRole.COACH)
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateExerciseDto,
  ) {
    const coachId = userId;
    return this.exercisesService.create(dto, coachId);
  }

  @Put(':id')
  @Roles(UserRole.COACH)
  async update(@Param('id') id: string, @Body() dto: UpdateExerciseDto) {
    return this.exercisesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.COACH)
  async remove(@Param('id') id: string) {
    await this.exercisesService.remove(id);
    return { message: 'Exercise deleted' };
  }
}