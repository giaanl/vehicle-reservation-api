import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Gianluca Paschoalotti',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'E-mail do usuário (deve ser único)',
    example: 'gianluca@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres, máximo 100)',
    example: 'senha123',
    minLength: 6,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
