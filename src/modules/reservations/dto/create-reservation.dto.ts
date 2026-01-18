import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateReservationDTO {
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
