import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { comparePassword, hashPassword } from 'src/common/utils/hashPassword';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) { }
  async findAll(): Promise<object> {
    return {
      message: 'Successfully fetched all users',
      data: await this.userModel.find(),
    };
  }

  async create(createUserDto: CreateUserDto): Promise<object> {
    createUserDto.password = hashPassword(createUserDto.password);
    const createdUser = await this.userModel.create(createUserDto);
    delete createdUser.password;
    const token = await this.jwtService.signAsync({ id: createdUser._id });
    return {
      message: 'Successfully created user',
      token,
      data: createdUser,
    };
  }

  async login({ email, password }: LoginUserDto): Promise<object> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return {
        message: 'Invalid credentials',
      };
    }
    if (!comparePassword(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    delete user.password;
    const token = await this.jwtService.signAsync({ id: user._id });
    return {
      message: 'Successfully logged in',
      token,
      data: user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<object> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true });
    return {
      message: 'Successfully updated user',
      data: updatedUser,
    };
  }
}

