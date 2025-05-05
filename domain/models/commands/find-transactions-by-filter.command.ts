import { TransactionType } from '../enums/transaction-type.enum';

export type FindTransactionsByFilterCommand = {
  limit: number;
  page: number;
  fromDate?: Date;
  toDate?: Date;
  type?: TransactionType;
};
