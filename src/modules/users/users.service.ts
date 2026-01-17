import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create({ name, email, password }: CreateUserDTO): Promise<CreateUserResponseDTO> {
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

    await created.save()

    return { id: created._id.toString(), name: created.name, email: created.email };
  }

  private async hashPassword(password: string): Promise<string> {
    const rounds = Number(process.env.SALT_ROUNDS ?? 10);
    return bcrypt.hash(password, rounds);
  }
}
