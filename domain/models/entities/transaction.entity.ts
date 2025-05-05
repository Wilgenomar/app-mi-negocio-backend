import { TransactionType } from '../enums/transaction-type.enum';

export class Transaction {
  id!: number;
  constructor(
    public type: TransactionType,
    public amount: number,
    public description?: string,
    public accountType?: string,
    public accountNumber?: string,
    public name?: string,
    public documentType?: string,
    public documentNumber?: string,
    public bank?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
