import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ReservationStatus } from '../schemas/reservation.schema';

export class ListReservationsDTO {
  @ApiPropertyOptional({
    description: 'Filtrar por status da reserva',
    enum: ReservationStatus,
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiPropertyOptional({
    description: 'Número da página para paginação',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página',
    example: 10,
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
