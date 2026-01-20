import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vehicle } from './schemas/vehicle.schema';
import {
  Reservation,
  ReservationStatus,
} from '../reservations/schemas/reservation.schema';
import { CreateVehicleDTO } from './dto/create-vehicle.dto';
import { CreateVehicleResponseDTO } from './dto/create-vehicle-response.dto';
import { ListVehiclesDTO } from './dto/list-vehicles.dto';
import {
  ListVehiclesResponseDTO,
  VehicleItemDTO,
} from './dto/list-vehicles-response.dto';
import { UpdateVehicleDTO } from './dto/update-vehicle.dto';
import { UpdateVehicleResponseDTO } from './dto/update-vehicle-response.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
  ) {}

  async create(
    createVehicleDTO: CreateVehicleDTO,
  ): Promise<CreateVehicleResponseDTO> {
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

  async findByIdIncludingDeleted(id: string): Promise<Vehicle | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    return this.vehicleModel.findOne({
      _id: new Types.ObjectId(id),
    });
  }

  async findAll(listDTO: ListVehiclesDTO): Promise<ListVehiclesResponseDTO> {
    const { available, page = 1, limit = 10 } = listDTO;
    const skip = (page - 1) * limit;

    const filter = { deletedAt: null };

    const [vehicles, total] = await Promise.all([
      this.vehicleModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.vehicleModel.countDocuments(filter),
    ]);

    const activeReservations = await this.reservationModel.find({
      vehicleId: { $in: vehicles.map((v) => v._id) },
      status: {
        $in: [ReservationStatus.ACTIVE, ReservationStatus.PENDING],
      },
    });

    const reservedVehicleIds = new Set(
      activeReservations.map((r) => r.vehicleId.toString()),
    );

    let data: VehicleItemDTO[] = vehicles.map((vehicle) => ({
      id: vehicle._id.toString(),
      name: vehicle.name,
      year: vehicle.year,
      type: vehicle.type,
      engine: vehicle.engine,
      size: vehicle.size,
      available: !reservedVehicleIds.has(vehicle._id.toString()),
    }));

    if (available !== undefined) {
      data = data.filter((v) => v.available === available);
    }

    return {
      data,
      total: available !== undefined ? data.length : total,
      page,
      limit,
      totalPages: Math.ceil(
        (available !== undefined ? data.length : total) / limit,
      ),
    };
  }

  async update(
    id: string,
    updateData: UpdateVehicleDTO,
  ): Promise<UpdateVehicleResponseDTO> {
    const vehicle = await this.findById(id);
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined),
    );

    Object.assign(vehicle, filteredData);

    await vehicle.save();

    return {
      id: vehicle._id.toString(),
      name: vehicle.name,
      year: vehicle.year,
      type: vehicle.type,
      engine: vehicle.engine,
      size: vehicle.size,
    };
  }

  async delete(id: string): Promise<void> {
    const vehicle = await this.findById(id);

    vehicle.deletedAt = new Date();
    await vehicle.save();
  }
}
