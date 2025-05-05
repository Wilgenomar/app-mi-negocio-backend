import {
  IsNumber,
  Min,
  IsOptional,
  MaxLength,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @Min(500)
  amount: number;

  @IsString()
  accountType: string;

  @IsString()
  accountNumber: string;

  @IsString()
  name: string;

  @IsString()
  documentType: string;

  @IsString()
  documentNumber: string;

  @IsString()
  bank: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  description?: string;
}
