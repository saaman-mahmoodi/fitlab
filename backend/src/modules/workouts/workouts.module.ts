import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './entities/workout.entity';
import { WorkoutSet } from './entities/workout-set.entity';
import { Client } from '../clients/entities/client.entity';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { CoachesModule } from '../coaches/coaches.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workout, WorkoutSet, Client]),
    forwardRef(() => CoachesModule),
  ],
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}