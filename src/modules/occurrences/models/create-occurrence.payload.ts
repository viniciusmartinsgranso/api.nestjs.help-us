import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { DefaultValidationMessages } from '../../../common/validations/default-validation-messages';
import { OccurrenceTypeEnum } from '../../users/models/occurrence-type.enum';

export class CreateOccurrencePayload {
  @ApiProperty()
  @IsDefined({ message: 'É necessário informar o nome.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @MaxLength(128, { message: 'O nome não pode ter mais que 128 caracteres.' })
  public title!: string;

  @ApiProperty()
  @IsDefined({ message: 'É necessário informar o nome.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @MaxLength(128, { message: 'O nome não pode ter mais que 128 caracteres.' })
  public description!: string;

  @ApiProperty({ enum: OccurrenceTypeEnum })
  @IsDefined({ message: 'É necessário informar o tipo de ocorrência.' })
  @IsEnum(OccurrenceTypeEnum, {
    message: 'É necessário enviar o tipo de ocorrência.',
  })
  public type!: OccurrenceTypeEnum;

  @ApiProperty()
  @IsDefined({ message: 'É necessário informar a localização.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @MaxLength(256, {
    message: 'A localização não pode ter mais que 256 caracteres.',
  })
  public location!: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  public photoUrl?: string;
}
