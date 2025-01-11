import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  last_name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
