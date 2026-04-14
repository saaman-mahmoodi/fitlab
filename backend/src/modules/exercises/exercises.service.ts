import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { CreateExerciseDto, UpdateExerciseDto } from './dto';
import { PaginationDto, PaginatedResponse } from '../../common/dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
  ) {}

  async findAll(pagination: PaginationDto, category?: string, equipment?: string): Promise<PaginatedResponse<Exercise>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const search = pagination.search;

    const query = this.exercisesRepository
      .createQueryBuilder('exercise')
      .orderBy('exercise.is_custom', 'ASC')
      .addOrderBy('exercise.name', 'ASC');

    if (search) {
      query.andWhere('exercise.name ILIKE :search', { search: `%${search}%` });
    }

    if (category) {
      query.andWhere('exercise.category = :category', { category });
    }

    if (equipment) {
      query.andWhere('exercise.equipment = :equipment', { equipment });
    }

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Exercise> {
    const exercise = await this.exercisesRepository.findOne({ where: { id } });
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }
    return exercise;
  }

  async create(dto: CreateExerciseDto, coachId?: string): Promise<Exercise> {
    const exercise = this.exercisesRepository.create({
      name: dto.name,
      category: dto.category,
      instructions: dto.instructions,
      video_url: dto.video_url,
      thumbnail_url: dto.thumbnail_url,
      equipment: dto.equipment,
      muscle_groups: dto.muscle_groups,
      is_custom: true,
      created_by_coach_id: coachId ?? undefined,
    } as Partial<Exercise>);
    const saved = await this.exercisesRepository.save(exercise);
    return saved as Exercise;
  }

  async update(id: string, dto: UpdateExerciseDto): Promise<Exercise> {
    const exercise = await this.findById(id);
    Object.assign(exercise, dto);
    return this.exercisesRepository.save(exercise);
  }

  async remove(id: string): Promise<void> {
    const exercise = await this.findById(id);
    await this.exercisesRepository.remove(exercise);
  }

  async seed(exercises: Partial<Exercise>[]): Promise<void> {
    for (const exerciseData of exercises) {
      const name = exerciseData.name ?? '';
      const existing = await this.exercisesRepository.findOne({
        where: { name, is_custom: false },
      });
      if (!existing) {
        const exercise = this.exercisesRepository.create({
          ...exerciseData,
          is_custom: false,
        });
        await this.exercisesRepository.save(exercise);
      }
    }
  }
}