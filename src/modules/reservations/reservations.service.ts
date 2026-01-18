import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { Reservation, ReservationStatus } from './schemas/reservation.schema';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { CreateReservationResponseDTO } from './dto/create-reservation-response.dto';
import { VehiclesService } from '../vehicles/vehicles.service';

@Injectable()
export class ReservationsService {
  //   private readonly logger = new Logger(ReservationsService.name);

  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async create(
    userId: string,
    createReservationDTO: CreateReservationDTO,
  ): Promise<CreateReservationResponseDTO> {
    const { vehicleId, startDate, endDate } = createReservationDTO;

    await this.vehiclesService.findById(vehicleId);

    const vehicleActiveReservation = await this.reservationModel.findOne({
      vehicleId: new Types.ObjectId(vehicleId),
      status: ReservationStatus.ACTIVE,
    });

    if (vehicleActiveReservation) {
      throw new ConflictException('Veículo já está reservado');
    }

    const userActiveReservation = await this.reservationModel.findOne({
      userId: new Types.ObjectId(userId),
      status: ReservationStatus.ACTIVE,
    });

    if (userActiveReservation) {
      throw new ConflictException('Usuário já possui uma reserva ativa');
    }

    const created = new this.reservationModel({
      userId: new Types.ObjectId(userId),
      vehicleId: new Types.ObjectId(vehicleId),
      status: ReservationStatus.ACTIVE,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    });

    await created.save();

    return {
      id: created._id.toString(),
      userId: created.userId.toString(),
      vehicleId: created.vehicleId.toString(),
      status: created.status,
      startDate: created.startDate,
      endDate: created.endDate ?? null,
    };
  }

  // ----- Função teste - valida se a reserva chegou na data final e finaliza ela
  // @Cron(CronExpression.EVERY_HOUR)
  // async completeExpiredReservations(): Promise<void> {
  //   const now = new Date();

  //   const expiredReservations = await this.reservationModel.find({
  //     status: ReservationStatus.ACTIVE,
  //     endDate: { $lte: now, $ne: null },
  //   });

  //   if (expiredReservations.length === 0) {
  //     return;
  //   }

  //   this.logger.log(
  //     `Foram encontradas ${expiredReservations.length} reservas expiradas para finalizar.`,
  //   );

  //   await Promise.all(
  //     expiredReservations.map(async (reservation) => {
  //       const updated = await this.reservationModel.findOneAndUpdate(
  //         {
  //           _id: reservation._id,
  //           status: ReservationStatus.ACTIVE,
  //         },
  //         { status: ReservationStatus.COMPLETED },
  //       );

  //       if (!updated) return;

  //       this.logger.log(
  //         `Finalizada a reserva ${reservation._id} do veículo ${reservation.vehicleId}`,
  //       );
  //     }),
  //   );
  // }
}
