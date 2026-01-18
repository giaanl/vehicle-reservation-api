import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ReservationStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Schema({ timestamps: true })
export class Reservation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicleId: Types.ObjectId;

  @Prop({ required: true, enum: ReservationStatus, default: ReservationStatus.ACTIVE })
  status: ReservationStatus;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ type: Date, default: null })
  endDate?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

ReservationSchema.index(
  { userId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: ReservationStatus.ACTIVE }
  },
);

ReservationSchema.index(
  { vehicleId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: ReservationStatus.ACTIVE }
  },
);

ReservationSchema.index({ userId: 1, createdAt: -1 });

ReservationSchema.index({ vehicleId: 1, createdAt: -1 });
