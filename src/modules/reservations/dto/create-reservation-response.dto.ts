import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReservationResponseDTO {
  @ApiProperty({
    description: 'ID único da reserva',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'ID do usuário que fez a reserva',
    example: '507f1f77bcf86cd799439012',
  })
  userId: string;

  @ApiProperty({
    description: 'ID do veículo reservado',
    example: '507f1f77bcf86cd799439013',
  })
  vehicleId: string;

  @ApiProperty({
    description: 'Status da reserva',
    example: 'ACTIVE',
    enum: ['PENDING', 'ACTIVE', 'CANCELLED', 'COMPLETED'],
  })
  status: string;

  @ApiProperty({
    description: 'Data de início da reserva',
    example: '2024-01-15T10:00:00.000Z',
  })
  startDate: Date;

  @ApiPropertyOptional({
    description: 'Data de fim da reserva',
    example: '2024-01-20T10:00:00.000Z',
    nullable: true,
  })
  endDate: Date | null;
}
