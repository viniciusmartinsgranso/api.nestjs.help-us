import { PartialType } from '@nestjs/swagger';
import { CreateResidencePayload } from './create-residence.payload';

export class UpdateResidenceProxy extends PartialType(CreateResidencePayload) {}
