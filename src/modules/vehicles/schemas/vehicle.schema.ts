import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Vehicle extends Document {
  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  vehicleModel: string;

  @Prop({ required: true, min: 1 })
  seats: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  engine: string;

  @Prop({ required: true, unique: true })
  licensePlate: string;

  @Prop({ required: true })
  year: number;

  @Prop({ default: false })
  reserved: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

VehicleSchema.index(
  { licensePlate: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);
