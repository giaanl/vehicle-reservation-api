import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Vehicle extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  engine: string;

  @Prop({ required: true })
  size: string;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
