import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vehicle } from './schemas/vehicle.schema';
import { CreateVehicleDTO } from './dto/create-vehicle.dto';
import { CreateVehicleResponseDTO } from './dto/create-vehicle-response.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
  ) {}

  async create(createVehicleDTO: CreateVehicleDTO): Promise<CreateVehicleResponseDTO> {
    const created = new this.vehicleModel({
      ...createVehicleDTO,
    });

    await created.save();

    return {
      id: created._id.toString(),
      name: created.name,
      year: created.year,
      type: created.type,
      engine: created.engine,
      size: created.size,
    };
  }

  async findById(id: string): Promise<Vehicle> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Veículo não encontrado');
    }

    const vehicle = await this.vehicleModel.findOne({
      _id: new Types.ObjectId(id),
      deletedAt: null,
    });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    return vehicle;
  }
}
