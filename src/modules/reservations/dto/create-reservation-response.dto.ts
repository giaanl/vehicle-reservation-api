export class CreateReservationResponseDTO {
  id: string;
  userId: string;
  vehicleId: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
}
