import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateVehicleDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{4}$/, { message: 'year deve ser um ano válido no formato YYYY' })
  year?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  engine?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d+$/, { message: 'size deve ser um número válido' })
  size?: string;
}
