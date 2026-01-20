import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdateUserResponseDTO } from './dto/update-user-response.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create({
    name,
    email,
    password,
  }: CreateUserDTO): Promise<CreateUserResponseDTO> {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    const existingUser = await this.userModel.findOne({
      email: normalizedEmail,
      deletedAt: null,
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const passwordHash = await this.hashPassword(password);

    const created = new this.userModel({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
    });

    await created.save();

    return {
      id: created._id.toString(),
      name: created.name,
      email: created.email,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();
    return this.userModel.findOne({
      email: normalizedEmail,
      deletedAt: null,
    });
  }

  async comparePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  async update(
    id: string,
    updateData: UpdateUserDTO,
  ): Promise<UpdateUserResponseDTO> {
    const user = await this.userModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateData.email !== undefined) {
      const normalizedEmail = updateData.email.trim().toLowerCase();

      const existingUser = await this.userModel.findOne({
        email: normalizedEmail,
        deletedAt: null,
        _id: { $ne: id },
      });

      if (existingUser) {
        throw new ConflictException('Email já cadastrado');
      }

      user.email = normalizedEmail;
    }

    if (updateData.name !== undefined) {
      user.name = updateData.name.trim();
    }

    if (updateData.password !== undefined) {
      user.passwordHash = await this.hashPassword(updateData.password);
    }

    await user.save();

    return { id: user._id.toString(), name: user.name, email: user.email };
  }

  async softDelete(id: string): Promise<void> {
    const user = await this.userModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    user.deletedAt = new Date();
    await user.save();
  }

  private async hashPassword(password: string): Promise<string> {
    const rounds = Number(process.env.SALT_ROUNDS ?? 10);
    return bcrypt.hash(password, rounds);
  }
}
