import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateUserDTO {
  @ApiPropertyOptional({
    description: 'Nome completo do usuário',
    example: 'Gianluca Paschoalotti',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'E-mail do usuário',
    example: 'gianluca@email.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Nova senha do usuário (mínimo 6 caracteres, máximo 100)',
    example: 'novaSenha123',
    minLength: 6,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(100)
  password?: string;
}
