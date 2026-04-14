import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';
import { FormResponse } from './entities/form-response.entity';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { CoachesModule } from '../coaches/coaches.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Form, FormResponse]),
    CoachesModule,
  ],
  controllers: [FormsController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}