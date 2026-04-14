import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { ExercisesService } from '../../modules/exercises/exercises.service';
import { exerciseSeeds } from './exercise-seed';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const exercisesService = app.get(ExercisesService);

  console.log('Seeding exercises...');
  await exercisesService.seed(exerciseSeeds as Parameters<typeof exercisesService.seed>[0]);
  console.log(`Seeded ${exerciseSeeds.length} exercises.`);

  await app.close();
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});