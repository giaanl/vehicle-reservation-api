import { IsOptional, IsDateString } from 'class-validator';

export class UpdateReservationDTO {
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
