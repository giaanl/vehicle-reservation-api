import { ReservationStatus } from '../schemas/reservation.schema';

export class VehicleInfoDTO {
  name: string;
  year: string;
  type: string;
  engine: string;
  size: string;
}

export class ReservationItemDTO {
  id: string;
  userId: string;
  vehicleId: string;
  vehicle?: VehicleInfoDTO;
  status: ReservationStatus;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ListReservationsResponseDTO {
  data: ReservationItemDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
