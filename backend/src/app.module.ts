import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoachesModule } from './modules/coaches/coaches.module';
import { ClientsModule } from './modules/clients/clients.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { MessagesModule } from './modules/messages/messages.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { AutomationsModule } from './modules/automations/automations.module';
import { AiModule } from './modules/ai/ai.module';
import { ProgressModule } from './modules/progress/progress.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { NutritionModule } from './modules/nutrition/nutrition.module';
import { GroupsModule } from './modules/groups/groups.module';
import { FormsModule } from './modules/forms/forms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL', 60),
          limit: configService.get<number>('THROTTLE_LIMIT', 100),
        },
      ],
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        url: configService.get('DATABASE_URL'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
        logging: configService.get('NODE_ENV') === 'development' ? ['error', 'warn'] : ['error'],
      }),
      inject: [ConfigService],
    }),

    ScheduleModule.forRoot(),

    AuthModule,
    UsersModule,
    CoachesModule,
    ClientsModule,
    WorkoutsModule,
    ExercisesModule,
    MessagesModule,
    SubscriptionsModule,
    AutomationsModule,
    AiModule,
    ProgressModule,
    NotificationsModule,
    NutritionModule,
    GroupsModule,
    FormsModule,
  ],
})
export class AppModule {}