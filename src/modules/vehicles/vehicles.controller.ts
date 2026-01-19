import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDTO } from './dto/create-vehicle.dto';
import { CreateVehicleResponseDTO } from './dto/create-vehicle-response.dto';
import { ListVehiclesDTO } from './dto/list-vehicles.dto';
import { ListVehiclesResponseDTO } from './dto/list-vehicles-response.dto';
import { UpdateVehicleDTO } from './dto/update-vehicle.dto';
import { UpdateVehicleResponseDTO } from './dto/update-vehicle-response.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createVehicleDTO: CreateVehicleDTO,
  ): Promise<CreateVehicleResponseDTO> {
    return this.vehiclesService.create(createVehicleDTO);
  }

  @Get()
  async findAll(
    @Query() listVehiclesDTO: ListVehiclesDTO,
  ): Promise<ListVehiclesResponseDTO> {
    return this.vehiclesService.findAll(listVehiclesDTO);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDTO: UpdateVehicleDTO,
  ): Promise<UpdateVehicleResponseDTO> {
    return this.vehiclesService.update(id, updateVehicleDTO);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.vehiclesService.delete(id);
  }
}
