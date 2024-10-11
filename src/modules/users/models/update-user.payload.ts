import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { DefaultValidationMessages } from 'src/common/validations/default-validation-messages';
import { RolesEnum } from "../../../common/enums/roles.enum";

export class UpdateUserPayload {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  @MaxLength(128, { message: 'O nome não pode ter mais que 128 caracteres.' })
  public name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  @MaxLength(128, { message: 'O e-mail não pode ter mais que 255 caracteres.' })
  public email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  @MaxLength(128, { message: 'A cidade não pode ter mais que 255 caracteres.' })
  public city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: DefaultValidationMessages.IsString })
  public photoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  public roles?: RolesEnum[];
}
