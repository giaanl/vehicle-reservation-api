import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserResponseDTO {
  @ApiProperty({
    description: 'ID único do usuário',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Gianluca Paschoalotti',
  })
  name: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'gianluca@email.com',
  })
  email: string;
}
