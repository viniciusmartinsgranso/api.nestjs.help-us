import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from '../services/media.service';
import { ProtectTo } from '../../../decorators/protect/protect.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ProtectTo()
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    return await this.mediaService.uploadFile(file);
  }
}
