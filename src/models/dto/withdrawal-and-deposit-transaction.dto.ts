import {
  IsNumber,
  Min,
  IsOptional,
  MaxLength,
  IsString,
} from 'class-validator';

export class WithdrawalAndDepositTransactionDto {
  @IsNumber()
  @Min(500)
  amount: number;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  description?: string;
}
