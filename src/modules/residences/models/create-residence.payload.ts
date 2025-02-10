import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString, MaxLength } from 'class-validator';
import { DefaultValidationMessages } from '../../../common/validations/default-validation-messages';

export class CreateResidencePayload {
  @ApiProperty()
  @IsDefined({ message: 'É necessário informar o nome.' })
  @IsString({ message: DefaultValidationMessages.IsString })
  @MaxLength(128, { message: 'O nome não pode ter mais que 128 caracteres.' })
  public name!: string;

  @ApiProperty()
  @IsDefined({ message: 'É necessário informar a latitude.' })
  @IsNumber({ allowInfinity: true })
  public latitude!: number;

  @ApiProperty()
  @IsDefined({ message: 'É necessário informar a longitude.' })
  @IsNumber({ allowInfinity: true })
  public longitude!: number;
}
