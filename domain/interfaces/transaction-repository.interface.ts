import { FindTransactionsByFilterCommand } from '../models/commands/find-transactions-by-filter.command';
import { Transaction } from '../models/entities/transaction.entity';

export interface ITransactionRepository {
  find(filter: FindTransactionsByFilterCommand): Promise<Transaction[]>;
}
