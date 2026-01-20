import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleResponseDTO {
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
}
