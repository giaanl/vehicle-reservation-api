import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateVehicleDTO {
  @ApiProperty({
    description: 'Nome do veículo',
    example: 'Versa',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Ano de fabricação do veículo (formato YYYY)',
    example: '2023',
    pattern: '^\\d{4}$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}$/, { message: 'year deve ser um ano válido no formato YYYY' })
  year: string;

  @ApiProperty({
    description: 'Tipo do veículo (ex: Sedan médio, SUV, Hatch)',
    example: 'Sedan médio',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Tipo de motor do veículo',
    example: '1.4',
  })
  @IsString()
  @IsNotEmpty()
  engine: string;

  @ApiProperty({
    description: 'Capacidade do veículo (número)',
    example: '5',
    pattern: '^\\d+$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'size deve ser um número válido' })
  size: string;
}
