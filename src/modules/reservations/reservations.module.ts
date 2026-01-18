import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { VehiclesModule } from '../vehicles/vehicles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    VehiclesModule,
  ],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService],
})
export class ReservationsModule {}
