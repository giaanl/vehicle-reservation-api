import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDTO) {
    const user = await this.usersService.create(registerDto);

    return {
      message: 'Usuário registrado com sucesso',
      user,
    };
  }
}
