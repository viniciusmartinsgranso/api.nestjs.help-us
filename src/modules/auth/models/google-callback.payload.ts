import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleCallbackPayload {
  @ApiProperty({
    description: 'Código retornado pelo Google no redirect OAuth',
  })
  @IsString()
  @IsNotEmpty()
  public code!: string;
}
