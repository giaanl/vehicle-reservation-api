import {
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateVehicleDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}$/, { message: 'year deve ser um ano válido no formato YYYY' })
  year: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  engine: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'size deve ser um número válido' })
  size: string;
}
