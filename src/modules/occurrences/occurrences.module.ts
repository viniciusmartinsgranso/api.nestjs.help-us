import { Module } from '@nestjs/common';
import { OccurrencesService } from './services/occurrences.service';
import { OccurrencesController } from './controllers/occurrences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OccurrenceEntity } from './entities/occurrence.entity';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OccurrenceEntity, UserEntity])],
  controllers: [OccurrencesController],
  providers: [OccurrencesService],
  exports: [OccurrencesService],
})
export class OccurrencesModule {}
