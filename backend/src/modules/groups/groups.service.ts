import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TrainingGroup } from './entities/training-group.entity';
import { CreateGroupDto, UpdateGroupDto, AddMembersDto, RemoveMembersDto } from './dto';
import { CoachesService } from '../coaches/coaches.service';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(TrainingGroup)
    private groupRepo: Repository<TrainingGroup>,
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
    private coachesService: CoachesService,
  ) {}

  async findByCoachId(coachId: string): Promise<TrainingGroup[]> {
    return this.groupRepo.find({
      where: { coach_id: coachId },
      relations: ['members'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<TrainingGroup> {
    const group = await this.groupRepo.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async create(userId: string, dto: CreateGroupDto): Promise<TrainingGroup> {
    const coach = await this.coachesService.findByUserId(userId);
    const group = this.groupRepo.create({
      coach_id: coach.id,
      name: dto.name,
      description: dto.description ?? undefined,
    });

    if (dto.member_ids && dto.member_ids.length > 0) {
      const clients = await this.clientRepo.find({ where: { id: In(dto.member_ids) } });
      group.members = clients;
    }

    return this.groupRepo.save(group);
  }

  async update(id: string, dto: UpdateGroupDto): Promise<TrainingGroup> {
    const group = await this.findById(id);
    Object.assign(group, dto);
    return this.groupRepo.save(group);
  }

  async delete(id: string): Promise<void> {
    const result = await this.groupRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Group not found');
  }

  async addMembers(id: string, dto: AddMembersDto): Promise<TrainingGroup> {
    const group = await this.findById(id);
    const clients = await this.clientRepo.find({ where: { id: In(dto.client_ids) } });
    group.members = [...group.members, ...clients];
    return this.groupRepo.save(group);
  }

  async removeMembers(id: string, dto: RemoveMembersDto): Promise<TrainingGroup> {
    const group = await this.findById(id);
    group.members = group.members.filter(
      (member) => !dto.client_ids.includes(member.id),
    );
    return this.groupRepo.save(group);
  }
}