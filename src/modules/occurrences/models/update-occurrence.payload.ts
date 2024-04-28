import { PartialType } from '@nestjs/swagger';
import { CreateOccurrencePayload } from './create-occurrence.payload';

export class UpdateOccurrencePayload extends PartialType(CreateOccurrencePayload) {}
