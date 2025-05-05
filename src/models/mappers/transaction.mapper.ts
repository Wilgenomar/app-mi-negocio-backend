import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { FindTransactionsByFiltersDto } from '../dto/find-transactions-by-filters.dto';
import { FindTransactionsByFilterCommand } from 'domain/models/commands/find-transactions-by-filter.command';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction } from '../../../domain/models/entities/transaction.entity';
import { TransactionType } from '../../../domain/models/enums/transaction-type.enum';

export class TransactionMapper {
  public static toUseCaseCommand(
    filters: FindTransactionsByFiltersDto,
    pagination: PaginationQueryDto,
  ): FindTransactionsByFilterCommand {
    const { limit = 10, page = 1 } = pagination;

    const { fromDate, toDate, type } = filters;

    return {
      limit,
      page,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      type,
    };
  }

  public static toReceiveTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Transaction {
    const {
      amount,
      accountType,
      accountNumber,
      name,
      documentType,
      documentNumber,
      bank,
      description,
    } = createTransactionDto;

    return new Transaction(
      TransactionType.IN,
      amount,
      accountType,
      accountNumber,
      name,
      documentType,
      documentNumber,
      bank,
      new Date(),
      new Date(),
      description,
    );
  }
}
