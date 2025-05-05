import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TransactionType } from '../../../domain/models/enums/transaction-type.enum';

export class FindTransactionsByFiltersDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}
