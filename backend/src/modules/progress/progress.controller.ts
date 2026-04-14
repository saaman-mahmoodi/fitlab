import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateWeightLogDto, CreateMeasurementDto, CreateProgressPhotoDto } from './dto';
import { ParseDatePipe } from '../../common/pipes/parse-date.pipe';

@Controller('clients/:clientId/progress')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Post('weight')
  async logWeight(
    @Param('clientId') clientId: string,
    @Body() dto: CreateWeightLogDto,
  ) {
    return this.progressService.logWeight(clientId, dto);
  }

  @Get('weight')
  async getWeightHistory(
    @Param('clientId') clientId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.progressService.getWeightHistory(clientId, start, end);
  }

  @Post('measurements')
  async logMeasurement(
    @Param('clientId') clientId: string,
    @Body() dto: CreateMeasurementDto,
  ) {
    return this.progressService.logMeasurement(clientId, dto);
  }

  @Get('measurements')
  async getMeasurements(
    @Param('clientId') clientId: string,
    @Query('type') type?: string,
  ) {
    return this.progressService.getMeasurements(clientId, type);
  }

  @Post('photos')
  async addProgressPhoto(
    @Param('clientId') clientId: string,
    @Body() dto: CreateProgressPhotoDto,
  ) {
    return this.progressService.addProgressPhoto(clientId, dto);
  }

  @Get('photos')
  async getProgressPhotos(@Param('clientId') clientId: string) {
    return this.progressService.getProgressPhotos(clientId);
  }

  @Delete('photos/:id')
  async deleteProgressPhoto(@Param('id') id: string) {
    await this.progressService.deleteProgressPhoto(id);
    return { message: 'Progress photo deleted' };
  }
}