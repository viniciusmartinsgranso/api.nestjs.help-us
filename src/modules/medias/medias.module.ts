import { Module } from '@nestjs/common';
import { MediaService } from './services/media.service';
import { MediasController } from './controllers/medias.controller';

@Module({
  controllers: [MediasController],
  providers: [MediaService],
})
export class MediasModule {}
