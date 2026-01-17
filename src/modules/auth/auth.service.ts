import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDTO) {
    const user = await this.usersService.create(registerDto);

    return {
      message: 'Usuário registrado com sucesso',
      user,
    };
  }

  async login(loginDto: LoginDTO, response: Response) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const isPasswordValid = await this.usersService.comparePassword(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    this.setAuthCookie(response, accessToken);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  logout(response: Response) {
    this.clearAuthCookie(response);
    return { message: 'Logout realizado com sucesso' };
  }

  private setAuthCookie(response: Response, token: string) {
    const expirationInSeconds = Number(
      this.configService.get<string>('JWT_EXPIRATION', '86400'),
    );
    const expirationInMs = expirationInSeconds * 1000;

    const isProduction = process.env.NODE_ENV === 'production';

    response.cookie('authToken', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: expirationInMs,
      path: '/',
    });
  }

  private clearAuthCookie(response: Response) {
    const isProduction = process.env.NODE_ENV === 'production';

    response.clearCookie('authToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
    });
  }

  async validateUser(userId: string) {
    const user = await this.usersService.findByEmail(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return user;
  }
}
