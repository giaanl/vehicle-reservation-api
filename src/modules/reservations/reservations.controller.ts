import {
  Controller,
  Post,
  Get,
  Patch,
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
import { ReservationsService } from './reservations.service';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { CreateReservationResponseDTO } from './dto/create-reservation-response.dto';
import { ListReservationsDTO } from './dto/list-reservations.dto';
import { ListReservationsResponseDTO, ReservationItemDTO } from './dto/list-reservations-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Reservas')
@ApiBearerAuth('JWT-auth')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar nova reserva',
    description: 'Cria uma nova reserva de veículo para o usuário autenticado',
  })
  @ApiResponse({
    status: 201,
    description: 'Reserva criada com sucesso',
    type: CreateReservationResponseDTO,
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
  @ApiResponse({
    status: 409,
    description: 'Conflito - Veículo já está reservado ou usuário já possui uma reserva ativa',
  })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createReservationDTO: CreateReservationDTO,
  ): Promise<CreateReservationResponseDTO> {
    return this.reservationsService.create(userId, createReservationDTO);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar reservas do usuário',
    description: 'Retorna uma lista paginada das reservas do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas retornada com sucesso',
    type: ListReservationsResponseDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou ausente',
  })
  async findByUser(
    @CurrentUser('id') userId: string,
    @Query() listReservationsDTO: ListReservationsDTO,
  ): Promise<ListReservationsResponseDTO> {
    return this.reservationsService.findByUserId(userId, listReservationsDTO);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancelar reserva',
    description: 'Cancela uma reserva existente do usuário autenticado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da reserva',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva cancelada com sucesso',
    type: ReservationItemDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva não encontrada',
  })
  async cancel(
    @CurrentUser('id') userId: string,
    @Param('id') reservationId: string,
  ): Promise<ReservationItemDTO> {
    return this.reservationsService.cancel(userId, reservationId);
  }

  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Completar reserva',
    description: 'Marca uma reserva como concluída',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da reserva',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva completada com sucesso',
    type: ReservationItemDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Reserva não encontrada',
  })
  async complete(
    @CurrentUser('id') userId: string,
    @Param('id') reservationId: string,
  ): Promise<ReservationItemDTO> {
    return this.reservationsService.complete(userId, reservationId);
  }
}
