import {
  Controller,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdateUserResponseDTO } from './dto/update-user-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('Usuários')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  @ApiOperation({
    summary: 'Atualizar perfil do usuário',
    description: 'Atualiza os dados do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: UpdateUserResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'E-mail já está em uso por outro usuário',
  })
  async update(
    @CurrentUser('id') id: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<UpdateUserResponseDTO> {
    return this.usersService.update(id, updateUserDTO);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Excluir conta do usuário',
    description: 'Realiza a exclusão lógica (soft delete) da conta do usuário autenticado',
  })
  @ApiResponse({
    status: 204,
    description: 'Usuário excluído com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async delete(@CurrentUser('id') id: string): Promise<void> {
    return this.usersService.softDelete(id);
  }
}
