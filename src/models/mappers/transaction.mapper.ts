import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { FindTransactionsByFiltersDto } from '../dto/find-transactions-by-filters.dto';
import { FindTransactionsByFilterCommand } from 'domain/models/commands/find-transactions-by-filter.command';
import { CreateTransferTransactionDto } from '../dto/create-transfer-transaction.dto';
import { Transaction } from '../../../domain/models/entities/transaction.entity';
import { TransactionType } from '../../../domain/models/enums/transaction-type.enum';
import { WithdrawalAndDepositTransactionDto } from '../dto/withdrawal-and-deposit-transaction.dto';

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

  public static toTransferInTransaction(
    createTransactionDto: CreateTransferTransactionDto,
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
      TransactionType.TRANSFER_IN,
      amount,
      description,
      accountType,
      accountNumber,
      name,
      documentType,
      documentNumber,
      bank,
      new Date(),
      new Date(),
    );
  }

  public static toTransferOutTransaction(
    createTransactionDto: CreateTransferTransactionDto,
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
      TransactionType.TRANSFER_OUT,
      amount,
      description,
      accountType,
      accountNumber,
      name,
      documentType,
      documentNumber,
      bank,
      new Date(),
      new Date(),
    );
  }

  public static toWithdrawalTransaction(
    withdrawalTransaction: WithdrawalAndDepositTransactionDto,
  ): Transaction {
    return new Transaction(
      TransactionType.WITHDRAWAL,
      withdrawalTransaction.amount,
      withdrawalTransaction.description,
    );
  }

  public static toDepositTransaction(
    withdrawalTransaction: WithdrawalAndDepositTransactionDto,
  ): Transaction {
    return new Transaction(
      TransactionType.DEPOSIT,
      withdrawalTransaction.amount,
      withdrawalTransaction.description,
    );
  }
}
