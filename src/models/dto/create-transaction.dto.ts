import {
  IsEnum,
  IsNumber,
  Min,
  IsOptional,
  MaxLength,
  IsString,
} from 'class-validator';
import { TransactionType } from 'domain/models/enums/transaction-type.enum';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

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
