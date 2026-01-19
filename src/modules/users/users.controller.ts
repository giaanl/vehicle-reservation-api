import {
  Controller,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdateUserResponseDTO } from './dto/update-user-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  async update(
    @CurrentUser('id') id: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<UpdateUserResponseDTO> {
    return this.usersService.update(id, updateUserDTO);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentUser('id') id: string): Promise<void> {
    return this.usersService.softDelete(id);
  }
}
