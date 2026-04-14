import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form, FormStatus } from './entities/form.entity';
import { FormResponse } from './entities/form-response.entity';
import { CreateFormDto, UpdateFormDto, SubmitFormResponseDto } from './dto';
import { CoachesService } from '../coaches/coaches.service';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private formRepo: Repository<Form>,
    @InjectRepository(FormResponse)
    private responseRepo: Repository<FormResponse>,
    private coachesService: CoachesService,
  ) {}

  async findByCoachId(coachId: string): Promise<Form[]> {
    return this.formRepo.find({
      where: { coach_id: coachId },
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<Form> {
    const form = await this.formRepo.findOne({ where: { id } });
    if (!form) throw new NotFoundException('Form not found');
    return form;
  }

  async create(userId: string, dto: CreateFormDto): Promise<Form> {
    const coach = await this.coachesService.findByUserId(userId);
    const form = this.formRepo.create({
      ...dto,
      coach_id: coach.id,
      status: dto.status ?? FormStatus.DRAFT,
    });
    return this.formRepo.save(form);
  }

  async update(id: string, dto: UpdateFormDto): Promise<Form> {
    const form = await this.findById(id);
    Object.assign(form, dto);
    return this.formRepo.save(form);
  }

  async delete(id: string): Promise<void> {
    const result = await this.formRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Form not found');
  }

  async submitResponse(dto: SubmitFormResponseDto): Promise<FormResponse> {
    const form = await this.findById(dto.form_id);
    if (form.status !== FormStatus.PUBLISHED) {
      throw new NotFoundException('Form is not accepting responses');
    }
    const response = this.responseRepo.create({
      form_id: dto.form_id,
      client_id: dto.client_id,
      answers: dto.answers,
    });
    return this.responseRepo.save(response);
  }

  async getResponses(formId: string): Promise<FormResponse[]> {
    return this.responseRepo.find({
      where: { form_id: formId },
      order: { created_at: 'DESC' },
    });
  }

  async publish(id: string): Promise<Form> {
    const form = await this.findById(id);
    form.status = FormStatus.PUBLISHED;
    return this.formRepo.save(form);
  }

  async close(id: string): Promise<Form> {
    const form = await this.findById(id);
    form.status = FormStatus.CLOSED;
    return this.formRepo.save(form);
  }
}