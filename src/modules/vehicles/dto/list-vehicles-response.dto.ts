export class VehicleItemDTO {
  id: string;
  name: string;
  year: string;
  type: string;
  engine: string;
  size: string;
  available: boolean;
}

export class ListVehiclesResponseDTO {
  data: VehicleItemDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
