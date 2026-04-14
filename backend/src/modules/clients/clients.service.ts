import { forwardRef, Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto, UpdateClientDto } from './dto';
import { UsersService } from '../users/users.service';
import { CoachesService } from '../coaches/coaches.service';
import { ClientStatus } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    private usersService: UsersService,
    @Inject(forwardRef(() => CoachesService))
    private coachesService: CoachesService,
  ) {}

  async create(coachUserId: string, dto: CreateClientDto): Promise<Client> {
    const coach = await this.coachesService.findByUserId(coachUserId);

    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    const client = this.clientsRepository.create({
      coach_id: coach.id,
      user_id: user.id,
      goals: dto.goals,
      metrics: dto.metrics,
      tags: dto.tags,
      notes: dto.notes,
      status: ClientStatus.ACTIVE,
    });

    return this.clientsRepository.save(client);
  }

  async findByCoachId(coachId: string, page = 1, limit = 20, search?: string): Promise<[Client[], number]> {
    const query = this.clientsRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .where('client.coach_id = :coachId', { coachId })
      .orderBy('client.created_at', 'DESC');

    if (search) {
      query.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    query.skip((page - 1) * limit).take(limit);

    return query.getManyAndCount();
  }

  async findById(id: string): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: { id },
      relations: ['user', 'coach'],
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findById(id);
    Object.assign(client, dto);
    return this.clientsRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findById(id);
    client.status = ClientStatus.INACTIVE;
    await this.clientsRepository.save(client);
  }
}