// user.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @MinLength(6)
  password: string;
}
