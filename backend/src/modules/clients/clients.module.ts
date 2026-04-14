import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { UsersModule } from '../users/users.module';
import { CoachesModule } from '../coaches/coaches.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    UsersModule,
    forwardRef(() => CoachesModule),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}