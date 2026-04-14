import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from './entities/workout.entity';
import { WorkoutSet } from './entities/workout-set.entity';
import { Client } from '../clients/entities/client.entity';
import {
  CreateWorkoutDto,
  UpdateWorkoutDto,
  AddWorkoutSetDto,
  UpdateWorkoutSetDto,
} from './dto';
import { PaginationDto, PaginatedResponse } from '../../common/dto';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private workoutsRepository: Repository<Workout>,
    @InjectRepository(WorkoutSet)
    private workoutSetsRepository: Repository<WorkoutSet>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(dto: CreateWorkoutDto): Promise<Workout> {
    const workout = this.workoutsRepository.create({
      client_id: dto.client_id,
      title: dto.title,
      date: new Date(dto.date),
      notes: dto.notes,
      generated_by_ai: dto.generated_by_ai ?? false,
      metadata: dto.metadata,
    });

    const savedWorkout = await this.workoutsRepository.save(workout);

    if (dto.sets && dto.sets.length > 0) {
      const workoutSets = dto.sets.map((setDto) =>
        this.workoutSetsRepository.create({
          workout_id: savedWorkout.id,
          exercise_id: setDto.exercise_id,
          sets: setDto.sets,
          reps: setDto.reps,
          weight: setDto.weight,
          rir: setDto.rir,
          duration_seconds: setDto.duration_seconds,
          notes: setDto.notes,
        }),
      );
      await this.workoutSetsRepository.save(workoutSets);
    }

    return this.findById(savedWorkout.id);
  }

  async findByClientId(
    clientId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponse<Workout>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;

    const query = this.workoutsRepository
      .createQueryBuilder('workout')
      .leftJoinAndSelect('workout.sets', 'sets')
      .leftJoinAndSelect('sets.exercise', 'exercise')
      .where('workout.client_id = :clientId', { clientId })
      .orderBy('workout.date', 'DESC');

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

  async findById(id: string): Promise<Workout> {
    const workout = await this.workoutsRepository.findOne({
      where: { id },
      relations: ['sets', 'sets.exercise', 'client'],
    });
    if (!workout) {
      throw new NotFoundException('Workout not found');
    }
    return workout;
  }

  async update(id: string, dto: UpdateWorkoutDto): Promise<Workout> {
    const workout = await this.findById(id);
    Object.assign(workout, {
      ...dto,
      date: dto.date ? new Date(dto.date) : workout.date,
    });
    return this.workoutsRepository.save(workout);
  }

  async remove(id: string): Promise<void> {
    const workout = await this.findById(id);
    await this.workoutSetsRepository.delete({ workout_id: id });
    await this.workoutsRepository.remove(workout);
  }

  async addSet(workoutId: string, dto: AddWorkoutSetDto): Promise<WorkoutSet> {
    await this.findById(workoutId);
    const workoutSet = this.workoutSetsRepository.create({
      workout_id: workoutId,
      exercise_id: dto.exercise_id,
      sets: dto.sets,
      reps: dto.reps,
      weight: dto.weight,
      rir: dto.rir,
      duration_seconds: dto.duration_seconds,
      notes: dto.notes,
    });
    return this.workoutSetsRepository.save(workoutSet);
  }

  async updateSet(setId: string, dto: UpdateWorkoutSetDto): Promise<WorkoutSet> {
    const workoutSet = await this.workoutSetsRepository.findOne({
      where: { id: setId },
    });
    if (!workoutSet) {
      throw new NotFoundException('Workout set not found');
    }
    Object.assign(workoutSet, dto);
    return this.workoutSetsRepository.save(workoutSet);
  }

  async removeSet(setId: string): Promise<void> {
    const workoutSet = await this.workoutSetsRepository.findOne({
      where: { id: setId },
    });
    if (!workoutSet) {
      throw new NotFoundException('Workout set not found');
    }
    await this.workoutSetsRepository.remove(workoutSet);
  }

  async verifyCoachAccess(workoutId: string, coachId: string): Promise<void> {
    const workout = await this.findById(workoutId);
    const client = await this.clientRepository.findOne({
      where: { id: workout.client_id },
    });
    if (!client || client.coach_id !== coachId) {
      throw new ForbiddenException('You do not have access to this workout');
    }
  }
}