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
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { CreateClientDto, UpdateClientDto } from './dto';
import { PaginationDto } from '../../common/dto';
import { UserRole } from '../users/entities/user.entity';
import { CoachesService } from '../coaches/coaches.service';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.COACH)
export class ClientsController {
  constructor(
    private clientsService: ClientsService,
    private coachesService: CoachesService,
  ) {}

  @Get()
  async list(
    @CurrentUser('id') userId: string,
    @Query() pagination: PaginationDto,
  ) {
    const coach = await this.coachesService.findByUserId(userId);
    const [items, total] = await this.clientsService.findByCoachId(
      coach.id,
      pagination.page ?? 1,
      pagination.limit ?? 20,
      pagination.search,
    );
    return {
      items,
      total,
      page: pagination.page ?? 1,
      limit: pagination.limit ?? 20,
      totalPages: Math.ceil(total / (pagination.limit ?? 20)),
    };
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.clientsService.findById(id);
  }

  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateClientDto,
  ) {
    return this.clientsService.create(userId, dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.clientsService.remove(id);
    return { message: 'Client deactivated' };
  }
}