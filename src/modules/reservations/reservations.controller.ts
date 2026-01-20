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
import { ReservationsService } from './reservations.service';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { CreateReservationResponseDTO } from './dto/create-reservation-response.dto';
import { ListReservationsDTO } from './dto/list-reservations.dto';
import { ListReservationsResponseDTO, ReservationItemDTO } from './dto/list-reservations-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser('id') userId: string,
    @Body() createReservationDTO: CreateReservationDTO,
  ): Promise<CreateReservationResponseDTO> {
    return this.reservationsService.create(userId, createReservationDTO);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findByUser(
    @CurrentUser('id') userId: string,
    @Query() listReservationsDTO: ListReservationsDTO,
  ): Promise<ListReservationsResponseDTO> {
    return this.reservationsService.findByUserId(userId, listReservationsDTO);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(
    @CurrentUser('id') userId: string,
    @Param('id') reservationId: string,
  ): Promise<ReservationItemDTO> {
    return this.reservationsService.cancel(userId, reservationId);
  }

  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  async complete(
    @CurrentUser('id') userId: string,
    @Param('id') reservationId: string,
  ): Promise<ReservationItemDTO> {
    return this.reservationsService.complete(userId, reservationId);
  }
}
