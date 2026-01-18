import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDTO } from './dto/create-vehicle.dto';
import { CreateVehicleResponseDTO } from './dto/create-vehicle-response.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createVehicleDTO: CreateVehicleDTO): Promise<CreateVehicleResponseDTO> {
    return this.vehiclesService.create(createVehicleDTO);
  }
}
