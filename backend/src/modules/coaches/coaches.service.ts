import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coach } from './entities/coach.entity';
import { UpdateCoachDto } from './dto';

@Injectable()
export class CoachesService {
  constructor(
    @InjectRepository(Coach)
    private coachesRepository: Repository<Coach>,
  ) {}

  async create(userId: string): Promise<Coach> {
    const coach = this.coachesRepository.create({ user_id: userId });
    return this.coachesRepository.save(coach);
  }

  async findByUserId(userId: string): Promise<Coach> {
    const coach = await this.coachesRepository.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });
    if (!coach) {
      throw new NotFoundException('Coach profile not found');
    }
    return coach;
  }

  async findById(id: string): Promise<Coach> {
    const coach = await this.coachesRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!coach) {
      throw new NotFoundException('Coach profile not found');
    }
    return coach;
  }

  async update(userId: string, dto: UpdateCoachDto): Promise<Coach> {
    const coach = await this.findByUserId(userId);
    Object.assign(coach, dto);
    return this.coachesRepository.save(coach);
  }

  async getClientCount(coachId: string): Promise<number> {
    return this.coachesRepository
      .createQueryBuilder('coach')
      .leftJoinAndSelect('coach.clients', 'client')
      .where('coach.id = :id', { id: coachId })
      .getCount();
  }
}