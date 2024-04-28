import { Test, TestingModule } from '@nestjs/testing';
import { OccurrencesController } from './occurrences.controller';
import { OccurrencesService } from '../services/occurrences.service';

describe('OccurrencesController', () => {
  let controller: OccurrencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OccurrencesController],
      providers: [OccurrencesService],
    }).compile();

    controller = module.get<OccurrencesController>(OccurrencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
