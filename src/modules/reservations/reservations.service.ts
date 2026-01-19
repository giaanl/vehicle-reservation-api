import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { Reservation, ReservationStatus } from './schemas/reservation.schema';
import { CreateReservationDTO } from './dto/create-reservation.dto';
import { CreateReservationResponseDTO } from './dto/create-reservation-response.dto';
import { ListReservationsDTO } from './dto/list-reservations.dto';
import {
  ListReservationsResponseDTO,
  ReservationItemDTO,
} from './dto/list-reservations-response.dto';
import { UpdateReservationDTO } from './dto/update-reservation.dto';
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

  async findByUserId(
    userId: string,
    listReservationsDTO: ListReservationsDTO,
  ): Promise<ListReservationsResponseDTO> {
    const { status, page = 1, limit = 10 } = listReservationsDTO;

    const filter: { userId: Types.ObjectId; status?: ReservationStatus } = {
      userId: new Types.ObjectId(userId),
    };

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [reservations, total] = await Promise.all([
      this.reservationModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.reservationModel.countDocuments(filter),
    ]);

    const data: ReservationItemDTO[] = reservations.map((reservation) => ({
      id: reservation._id.toString(),
      userId: reservation.userId.toString(),
      vehicleId: reservation.vehicleId.toString(),
      status: reservation.status,
      startDate: reservation.startDate,
      endDate: reservation.endDate ?? null,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    userId: string,
    reservationId: string,
    updateReservationDTO: UpdateReservationDTO,
  ): Promise<ReservationItemDTO> {
    const reservation = await this.reservationModel.findOne({
      _id: new Types.ObjectId(reservationId),
      userId: new Types.ObjectId(userId),
    });

    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    if (reservation.status !== ReservationStatus.ACTIVE) {
      throw new BadRequestException(
        'Apenas reservas ativas podem ser atualizadas',
      );
    }

    if (updateReservationDTO.endDate) {
      reservation.endDate = new Date(updateReservationDTO.endDate);
    }

    await reservation.save();

    return {
      id: reservation._id.toString(),
      userId: reservation.userId.toString(),
      vehicleId: reservation.vehicleId.toString(),
      status: reservation.status,
      startDate: reservation.startDate,
      endDate: reservation.endDate ?? null,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    };
  }

  async cancel(userId: string, reservationId: string): Promise<ReservationItemDTO> {
    const reservation = await this.reservationModel.findOne({
      _id: new Types.ObjectId(reservationId),
      userId: new Types.ObjectId(userId),
    });

    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    if (reservation.status !== ReservationStatus.ACTIVE) {
      throw new BadRequestException('Apenas reservas ativas podem ser canceladas');
    }

    const now = new Date();
    if (reservation.startDate <= now) {
      throw new BadRequestException(
        'Não é possível cancelar uma reserva que já foi iniciada',
      );
    }

    reservation.status = ReservationStatus.CANCELLED;
    await reservation.save();

    return {
      id: reservation._id.toString(),
      userId: reservation.userId.toString(),
      vehicleId: reservation.vehicleId.toString(),
      status: reservation.status,
      startDate: reservation.startDate,
      endDate: reservation.endDate ?? null,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    };
  }

  async complete(userId: string, reservationId: string): Promise<ReservationItemDTO> {
    const reservation = await this.reservationModel.findOne({
      _id: new Types.ObjectId(reservationId),
      userId: new Types.ObjectId(userId),
    });

    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    if (reservation.status !== ReservationStatus.ACTIVE) {
      throw new BadRequestException('Apenas reservas ativas podem ser finalizadas');
    }

    reservation.status = ReservationStatus.COMPLETED;
    reservation.endDate = new Date();
    await reservation.save();

    return {
      id: reservation._id.toString(),
      userId: reservation.userId.toString(),
      vehicleId: reservation.vehicleId.toString(),
      status: reservation.status,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
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
