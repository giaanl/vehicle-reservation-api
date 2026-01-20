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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDTO } from './dto/create-vehicle.dto';
import { CreateVehicleResponseDTO } from './dto/create-vehicle-response.dto';
import { ListVehiclesDTO } from './dto/list-vehicles.dto';
import { ListVehiclesResponseDTO } from './dto/list-vehicles-response.dto';
import { UpdateVehicleDTO } from './dto/update-vehicle.dto';
import { UpdateVehicleResponseDTO } from './dto/update-vehicle-response.dto';

@ApiTags('Veículos')
@ApiBearerAuth('JWT-auth')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo veículo',
    description: 'Cadastra um novo veículo no sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Veículo criado com sucesso',
    type: CreateVehicleResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou ausente',
  })
  async create(
    @Body() createVehicleDTO: CreateVehicleDTO,
  ): Promise<CreateVehicleResponseDTO> {
    return this.vehiclesService.create(createVehicleDTO);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar veículos',
    description: 'Retorna uma lista paginada de veículos com filtros opcionais',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de veículos retornada com sucesso',
    type: ListVehiclesResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou ausente',
  })
  async findAll(
    @Query() listVehiclesDTO: ListVehiclesDTO,
  ): Promise<ListVehiclesResponseDTO> {
    return this.vehiclesService.findAll(listVehiclesDTO);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar veículo',
    description: 'Atualiza os dados de um veículo existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do veículo',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Veículo atualizado com sucesso',
    type: UpdateVehicleResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Veículo não encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDTO: UpdateVehicleDTO,
  ): Promise<UpdateVehicleResponseDTO> {
    return this.vehiclesService.update(id, updateVehicleDTO);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Excluir veículo',
    description: 'Remove um veículo do sistema (soft delete)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do veículo',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 204,
    description: 'Veículo excluído com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Veículo não encontrado',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.vehiclesService.delete(id);
  }
}
