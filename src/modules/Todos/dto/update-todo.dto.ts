import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsDate,
} from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  description: string;

  @IsDate()
  @IsOptional()
  date: Date;
}
