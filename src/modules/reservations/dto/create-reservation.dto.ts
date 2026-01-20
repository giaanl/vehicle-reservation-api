import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateReservationDTO {
  @ApiProperty({
    description: 'ID do veículo a ser reservado',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({
    description: 'Data de início da reserva (formato ISO 8601)',
    example: '2024-01-15T10:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiPropertyOptional({
    description: 'Data de fim da reserva (formato ISO 8601)',
    example: '2024-01-20T10:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
