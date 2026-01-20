import { ApiProperty } from '@nestjs/swagger';

export class VehicleItemDTO {
  @ApiProperty({
    description: 'ID único do veículo',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

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

  @ApiProperty({
    description: 'Indica se o veículo está disponível para reserva',
    example: true,
  })
  available: boolean;
}

export class ListVehiclesResponseDTO {
  @ApiProperty({
    description: 'Lista de veículos',
    type: [VehicleItemDTO],
  })
  data: VehicleItemDTO[];

  @ApiProperty({
    description: 'Total de veículos encontrados',
    example: 50,
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
    example: 5,
  })
  totalPages: number;
}
