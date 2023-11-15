import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @MinLength(6)
  @MaxLength(20)
  password: string;
}
