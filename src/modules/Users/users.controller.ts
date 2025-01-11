import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Throttle({})
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginUserDto) {
    return this.usersService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Put()
  update(@Body() updateUserDto: UpdateUserDto, @Request() req: Request & { user: { id: string } }) {
    return this.usersService.update(req.user.id, updateUserDto);
  }
}
