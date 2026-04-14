import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingGroup } from './entities/training-group.entity';
import { Client } from '../clients/entities/client.entity';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { CoachesModule } from '../coaches/coaches.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingGroup, Client]),
    CoachesModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}