import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
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
    const normalizedLicensePlate = createVehicleDTO.licensePlate.trim().toUpperCase();

    const existingVehicle = await this.vehicleModel.findOne({
      licensePlate: normalizedLicensePlate,
      deletedAt: null,
    });

    if (existingVehicle) {
      throw new ConflictException('Veículo com essa placa já cadastrado');
    }

    const created = new this.vehicleModel({
      ...createVehicleDTO,
      licensePlate: normalizedLicensePlate,
      reserved: false,
    });

    await created.save();

    return {
      id: created._id.toString(),
      brand: created.brand,
      vehicleModel: created.vehicleModel,
      seats: created.seats,
      type: created.type,
      engine: created.engine,
      licensePlate: created.licensePlate,
      year: created.year,
      reserved: created.reserved,
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

  async updateReservationStatus(id: string, reserved: boolean): Promise<void> {
    await this.vehicleModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { reserved },
    );
  }
}
