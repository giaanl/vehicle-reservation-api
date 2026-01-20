import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateVehicleDTO {
  @ApiPropertyOptional({
    description: 'Nome do veículo',
    example: 'Versa',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Ano de fabricação do veículo (formato YYYY)',
    example: '2023',
    pattern: '^\\d{4}$',
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}$/, {
    message: 'year deve ser um ano válido no formato YYYY',
  })
  year?: string;

  @ApiPropertyOptional({
    description: 'Tipo do veículo (ex: Sedan médio, SUV, Hatch)',
    example: 'Sedan médio',
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    description: 'Tipo de motor do veículo',
    example: '1.4',
  })
  @IsString()
  @IsOptional()
  engine?: string;

  @ApiPropertyOptional({
    description: 'Capacidade do veículo (número)',
    example: '5',
    pattern: '^\\d+$',
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d+$/, { message: 'size deve ser um número válido' })
  size?: string;
}
