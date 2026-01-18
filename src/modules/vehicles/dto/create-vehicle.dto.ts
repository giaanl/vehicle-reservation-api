import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateVehicleDTO {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  vehicleModel: string;

  @IsNumber()
  @Min(1)
  seats: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  engine: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  licensePlate: string;

  @IsNumber()
  @Min(1900)
  year: number;
}
