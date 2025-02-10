import { Module } from '@nestjs/common';
import { ResidenceService } from './service/residence.service';
import { ResidenceController } from './controller/residence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResidenceEntity } from './entities/residence.entity';

@Module({
  controllers: [ResidenceController],
  providers: [ResidenceService],
  imports: [TypeOrmModule.forFeature([ResidenceEntity])],
})
export class ResidencesModule {}
