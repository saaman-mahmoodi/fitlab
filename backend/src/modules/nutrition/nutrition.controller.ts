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
  ParseUUIDPipe,
} from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { CreateMealPlanDto, UpdateMealPlanDto, CreateFoodLogDto, UpdateFoodLogDto } from './dto';
import { UserRole } from '../users/entities/user.entity';

@Controller('nutrition')
@UseGuards(JwtAuthGuard)
export class NutritionController {
  constructor(private nutritionService: NutritionService) {}

  @Get('meal-plans/client/:clientId')
  async getMealPlans(@Param('clientId') clientId: string) {
    return this.nutritionService.findMealPlansByClient(clientId);
  }

  @Get('meal-plans/:id')
  async getMealPlan(@Param('id', ParseUUIDPipe) id: string) {
    return this.nutritionService.findMealPlanById(id);
  }

  @Post('meal-plans')
  @Roles(UserRole.COACH)
  async createMealPlan(@Body() dto: CreateMealPlanDto) {
    return this.nutritionService.createMealPlan(dto);
  }

  @Put('meal-plans/:id')
  @Roles(UserRole.COACH)
  async updateMealPlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMealPlanDto,
  ) {
    return this.nutritionService.updateMealPlan(id, dto);
  }

  @Delete('meal-plans/:id')
  @Roles(UserRole.COACH)
  async deleteMealPlan(@Param('id', ParseUUIDPipe) id: string) {
    await this.nutritionService.deleteMealPlan(id);
    return { message: 'Meal plan deleted' };
  }

  @Get('food-logs/client/:clientId')
  async getFoodLogs(
    @Param('clientId') clientId: string,
    @Query('date') date?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (date) return this.nutritionService.findFoodLogsByDate(clientId, date);
    if (startDate && endDate) return this.nutritionService.findFoodLogsByDateRange(clientId, startDate, endDate);
    return this.nutritionService.findFoodLogsByDate(clientId, new Date().toISOString().split('T')[0]);
  }

  @Get('food-logs/client/:clientId/summary')
  async getMacroSummary(
    @Param('clientId') clientId: string,
    @Query('date') date?: string,
  ) {
    return this.nutritionService.getMacroSummary(
      clientId,
      date || new Date().toISOString().split('T')[0],
    );
  }

  @Post('food-logs')
  async createFoodLog(@Body() dto: CreateFoodLogDto) {
    return this.nutritionService.createFoodLog(dto);
  }

  @Put('food-logs/:id')
  async updateFoodLog(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFoodLogDto,
  ) {
    return this.nutritionService.updateFoodLog(id, dto);
  }

  @Delete('food-logs/:id')
  async deleteFoodLog(@Param('id', ParseUUIDPipe) id: string) {
    await this.nutritionService.deleteFoodLog(id);
    return { message: 'Food log deleted' };
  }
}