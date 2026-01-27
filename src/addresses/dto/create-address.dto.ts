import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  zipCode: string;

  @IsOptional()
  @IsNumber()
  userId?: number; // Relacionado al usuario
}
