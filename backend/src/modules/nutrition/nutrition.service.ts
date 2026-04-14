import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MealPlan } from './entities/meal-plan.entity';
import { FoodLog } from './entities/food-log.entity';
import { CreateMealPlanDto, UpdateMealPlanDto, CreateFoodLogDto, UpdateFoodLogDto } from './dto';

@Injectable()
export class NutritionService {
  constructor(
    @InjectRepository(MealPlan)
    private mealPlanRepo: Repository<MealPlan>,
    @InjectRepository(FoodLog)
    private foodLogRepo: Repository<FoodLog>,
  ) {}

  async findMealPlansByClient(clientId: string): Promise<MealPlan[]> {
    return this.mealPlanRepo.find({
      where: { client_id: clientId },
      order: { start_date: 'DESC' },
    });
  }

  async findMealPlanById(id: string): Promise<MealPlan> {
    const plan = await this.mealPlanRepo.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Meal plan not found');
    return plan;
  }

  async createMealPlan(dto: CreateMealPlanDto): Promise<MealPlan> {
    const plan = this.mealPlanRepo.create({
      ...dto,
      start_date: new Date(dto.start_date),
      end_date: dto.end_date ? new Date(dto.end_date) : undefined,
    });
    return this.mealPlanRepo.save(plan);
  }

  async updateMealPlan(id: string, dto: UpdateMealPlanDto): Promise<MealPlan> {
    const plan = await this.findMealPlanById(id);
    Object.assign(plan, {
      ...dto,
      end_date: dto.end_date ? new Date(dto.end_date) : plan.end_date,
    });
    return this.mealPlanRepo.save(plan);
  }

  async deleteMealPlan(id: string): Promise<void> {
    const result = await this.mealPlanRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Meal plan not found');
  }

  async findFoodLogsByDate(clientId: string, date: string): Promise<FoodLog[]> {
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return this.foodLogRepo.find({
      where: { client_id: clientId, date: Between(start, end) },
      order: { meal_type: 'ASC' },
    });
  }

  async findFoodLogsByDateRange(clientId: string, startDate: string, endDate: string): Promise<FoodLog[]> {
    return this.foodLogRepo.find({
      where: {
        client_id: clientId,
        date: Between(new Date(startDate), new Date(endDate)),
      },
      order: { date: 'DESC', meal_type: 'ASC' },
    });
  }

  async createFoodLog(dto: CreateFoodLogDto): Promise<FoodLog> {
    const log = this.foodLogRepo.create({
      ...dto,
      date: new Date(dto.date),
    });
    return this.foodLogRepo.save(log);
  }

  async updateFoodLog(id: string, dto: UpdateFoodLogDto): Promise<FoodLog> {
    const log = await this.foodLogRepo.findOne({ where: { id } });
    if (!log) throw new NotFoundException('Food log not found');
    Object.assign(log, dto);
    return this.foodLogRepo.save(log);
  }

  async deleteFoodLog(id: string): Promise<void> {
    const result = await this.foodLogRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Food log not found');
  }

  async getMacroSummary(clientId: string, date: string) {
    const logs = await this.findFoodLogsByDate(clientId, date);
    return {
      date,
      total_calories: logs.reduce((sum, l) => sum + (Number(l.calories) || 0), 0),
      total_protein_g: logs.reduce((sum, l) => sum + (Number(l.protein_g) || 0), 0),
      total_carbs_g: logs.reduce((sum, l) => sum + (Number(l.carbs_g) || 0), 0),
      total_fat_g: logs.reduce((sum, l) => sum + (Number(l.fat_g) || 0), 0),
      total_fiber_g: logs.reduce((sum, l) => sum + (Number(l.fiber_g) || 0), 0),
      meals: logs,
    };
  }
}