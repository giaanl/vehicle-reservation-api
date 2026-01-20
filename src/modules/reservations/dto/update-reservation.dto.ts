import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class UpdateReservationDTO {
  @ApiPropertyOptional({
    description: 'Data de fim da reserva (formato ISO 8601)',
    example: '2024-01-20T10:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
