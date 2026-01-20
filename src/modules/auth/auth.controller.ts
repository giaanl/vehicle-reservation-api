import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateUserResponseDTO } from '../users/dto/create-user-response.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar novo usuário',
    description: 'Cria uma nova conta de usuário no sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    type: CreateUserResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'E-mail já está em uso',
  })
  register(@Body() registerDto: RegisterDTO) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Realizar login',
    description: 'Autentica o usuário e retorna um token JWT via cookie',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Login realizado com sucesso',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  async login(
    @Body() loginDto: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(loginDto, response);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obter usuário atual',
    description: 'Retorna os dados do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário retornados com sucesso',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            email: { type: 'string', example: 'usuario@exemplo.com' },
            name: { type: 'string', example: 'Gianluca Paschoalotti' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou ausente',
  })
  async getMe(@CurrentUser() user) {
    return { user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Realizar logout',
    description: 'Encerra a sessão do usuário removendo o cookie de autenticação',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Logout realizado com sucesso',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou ausente',
  })
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}
