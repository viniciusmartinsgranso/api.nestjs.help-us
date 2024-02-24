import { IsDefined, IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { DefaultValidationMessages } from "../../../common/validations/default-validation-messages";

export class CreateUserPayload {

    @ApiProperty()
    @IsDefined({ message: 'É necessário informar o nome.' })
    @IsString({ message: DefaultValidationMessages.IsString })
    @MaxLength(128, { message: 'O nome não pode ter mais que 128 caracteres.' })
    public name!: string;

    @ApiProperty()
    @IsDefined({ message: 'É necessário informar o e-mail.' })
    @IsString({ message: DefaultValidationMessages.IsString })
    @IsEmail({}, { message: DefaultValidationMessages.IsEmail })
    @MaxLength(128, { message: 'O e-mail não pode ter mais que 255 caracteres.' })
    public email!: string;

    @ApiProperty()
    @IsDefined({ message: 'É necessário informar a senha.' })
    @IsString({ message: DefaultValidationMessages.IsString })
    @MinLength(6, { message: 'A senha precisa ter no mínimo 6 caracteres.' })
    @MaxLength(55, { message: 'A senha não pode ter mais que 55 caracteres.' })
    public password!: string;

    @ApiProperty()
    @IsString({ message: DefaultValidationMessages.IsString })
    @MinLength(3, { message: 'A cidade precisa ter no mínimo 3 caracteres.' })
    @MaxLength(128, { message: 'A cidade não pode ter mais que 128 caracteres.' })
    public city!: string;
}
