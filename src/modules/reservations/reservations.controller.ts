import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { CreateReservationResponseDTO } from './dto/create-reservation-response.dto';
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
}
