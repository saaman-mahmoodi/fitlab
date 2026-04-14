import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { CreateFormDto, UpdateFormDto, SubmitFormResponseDto } from './dto';
import { UserRole } from '../users/entities/user.entity';

@Controller('forms')
@UseGuards(JwtAuthGuard)
export class FormsController {
  constructor(private formsService: FormsService) {}

  @Get()
  @Roles(UserRole.COACH)
  async list(@CurrentUser('id') userId: string) {
    return this.formsService.findByCoachId(userId);
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.formsService.findById(id);
  }

  @Get(':id/responses')
  @Roles(UserRole.COACH)
  async getResponses(@Param('id', ParseUUIDPipe) id: string) {
    return this.formsService.getResponses(id);
  }

  @Post()
  @Roles(UserRole.COACH)
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateFormDto) {
    return this.formsService.create(userId, dto);
  }

  @Put(':id')
  @Roles(UserRole.COACH)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFormDto) {
    return this.formsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.COACH)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.formsService.delete(id);
    return { message: 'Form deleted' };
  }

  @Post(':id/publish')
  @Roles(UserRole.COACH)
  async publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.formsService.publish(id);
  }

  @Post(':id/close')
  @Roles(UserRole.COACH)
  async close(@Param('id', ParseUUIDPipe) id: string) {
    return this.formsService.close(id);
  }

  @Post('respond')
  async submitResponse(@Body() dto: SubmitFormResponseDto) {
    return this.formsService.submitResponse(dto);
  }
}