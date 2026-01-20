import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReservationStatus } from '../schemas/reservation.schema';

export class VehicleInfoDTO {
  @ApiProperty({
    description: 'Nome do veículo',
    example: 'Versa',
  })
  name: string;

  @ApiProperty({
    description: 'Ano de fabricação do veículo',
    example: '2023',
  })
  year: string;

  @ApiProperty({
    description: 'Tipo do veículo',
    example: 'Sedan médio',
  })
  type: string;

  @ApiProperty({
    description: 'Tipo de motor do veículo',
    example: '1.4',
  })
  engine: string;

  @ApiProperty({
    description: 'Capacidade do veículo',
    example: '5',
  })
  size: string;
}

export class ReservationItemDTO {
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

  @ApiPropertyOptional({
    description: 'Informações do veículo reservado',
    type: VehicleInfoDTO,
  })
  vehicle?: VehicleInfoDTO;

  @ApiProperty({
    description: 'Status da reserva',
    enum: ReservationStatus,
    example: 'ACTIVE',
  })
  status: ReservationStatus;

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

  @ApiProperty({
    description: 'Data de criação da reserva',
    example: '2024-01-10T08:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização da reserva',
    example: '2024-01-10T08:00:00.000Z',
  })
  updatedAt: Date;
}

export class ListReservationsResponseDTO {
  @ApiProperty({
    description: 'Lista de reservas',
    type: [ReservationItemDTO],
  })
  data: ReservationItemDTO[];

  @ApiProperty({
    description: 'Total de reservas encontradas',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de páginas disponíveis',
    example: 3,
  })
  totalPages: number;
}
