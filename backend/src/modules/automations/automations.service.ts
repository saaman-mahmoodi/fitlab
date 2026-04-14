import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Automation } from './entities/automation.entity';
import { CreateAutomationDto, UpdateAutomationDto } from './dto';
import { CoachesService } from '../coaches/coaches.service';

@Injectable()
export class AutomationsService {
  constructor(
    @InjectRepository(Automation)
    private automationRepo: Repository<Automation>,
    private coachesService: CoachesService,
  ) {}

  async findByCoachId(coachId: string): Promise<Automation[]> {
    return this.automationRepo.find({
      where: { coach_id: coachId },
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<Automation> {
    const automation = await this.automationRepo.findOne({ where: { id } });
    if (!automation) {
      throw new NotFoundException('Automation not found');
    }
    return automation;
  }

  async create(userId: string, dto: CreateAutomationDto): Promise<Automation> {
    const coach = await this.coachesService.findByUserId(userId);
    const automation = this.automationRepo.create({
      ...dto,
      coach_id: coach.id,
    });
    return this.automationRepo.save(automation);
  }

  async update(id: string, dto: UpdateAutomationDto): Promise<Automation> {
    const automation = await this.findById(id);
    Object.assign(automation, dto);
    return this.automationRepo.save(automation);
  }

  async delete(id: string): Promise<void> {
    const result = await this.automationRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Automation not found');
    }
  }

  async toggleActive(id: string): Promise<Automation> {
    const automation = await this.findById(id);
    automation.is_active = !automation.is_active;
    return this.automationRepo.save(automation);
  }

  async getActiveAutomations(coachId: string): Promise<Automation[]> {
    return this.automationRepo.find({
      where: { coach_id: coachId, is_active: true },
    });
  }

  async incrementExecutionCount(id: string): Promise<void> {
    await this.automationRepo.update(id, {
      execution_count: () => 'execution_count + 1',
      last_executed_at: new Date(),
    });
  }
}