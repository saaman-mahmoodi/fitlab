import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { WeightLog, Measurement, ProgressPhoto } from './entities';
import { CreateWeightLogDto, CreateMeasurementDto, CreateProgressPhotoDto } from './dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(WeightLog)
    private weightLogRepo: Repository<WeightLog>,
    @InjectRepository(Measurement)
    private measurementRepo: Repository<Measurement>,
    @InjectRepository(ProgressPhoto)
    private progressPhotoRepo: Repository<ProgressPhoto>,
  ) {}

  async logWeight(clientId: string, dto: CreateWeightLogDto): Promise<WeightLog> {
    const entry = this.weightLogRepo.create({
      client_id: clientId,
      weight: dto.weight,
      date: new Date(dto.date),
      notes: dto.notes,
    });
    return this.weightLogRepo.save(entry);
  }

  async getWeightHistory(clientId: string, startDate?: Date, endDate?: Date): Promise<WeightLog[]> {
    const where: Record<string, unknown> = { client_id: clientId };
    if (startDate && endDate) {
      where.date = Between(startDate, endDate);
    }
    return this.weightLogRepo.find({
      where,
      order: { date: 'ASC' },
    });
  }

  async logMeasurement(clientId: string, dto: CreateMeasurementDto): Promise<Measurement> {
    const entry = this.measurementRepo.create({
      client_id: clientId,
      type: dto.type,
      value: dto.value,
      unit: dto.unit ?? 'inches',
      date: new Date(dto.date),
    });
    return this.measurementRepo.save(entry);
  }

  async getMeasurements(clientId: string, type?: string): Promise<Measurement[]> {
    const where: Record<string, unknown> = { client_id: clientId };
    if (type) {
      where.type = type;
    }
    return this.measurementRepo.find({ where, order: { date: 'ASC' } });
  }

  async addProgressPhoto(clientId: string, dto: CreateProgressPhotoDto): Promise<ProgressPhoto> {
    const entry = this.progressPhotoRepo.create({
      client_id: clientId,
      photo_url: dto.photo_url,
      date: new Date(dto.date),
      comparison_group: dto.comparison_group,
      notes: dto.notes,
    });
    return this.progressPhotoRepo.save(entry);
  }

  async getProgressPhotos(clientId: string): Promise<ProgressPhoto[]> {
    return this.progressPhotoRepo.find({
      where: { client_id: clientId },
      order: { date: 'ASC' },
    });
  }

  async deleteProgressPhoto(id: string): Promise<void> {
    const photo = await this.progressPhotoRepo.findOne({ where: { id } });
    if (!photo) {
      throw new NotFoundException('Progress photo not found');
    }
    await this.progressPhotoRepo.remove(photo);
  }
}