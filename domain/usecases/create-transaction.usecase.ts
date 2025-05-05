import { IBalanceRepository } from 'domain/interfaces/balance.repository.interface';
import { ITransactionRepository } from '../interfaces/transaction-repository.interface';
import { Transaction } from '../models/entities/transaction.entity';
import { TransactionType } from '../models/enums/transaction-type.enum';
import { CreateTransactionResponse } from '../models/types/create-transaction-response.type';

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly balanceRepository: IBalanceRepository,
  ) {}

  async execute(transaction: Transaction): Promise<CreateTransactionResponse> {
    try {
      const amountChange = this.getAmountChange(
        transaction.type,
        transaction.amount,
      );

      const savedTransaction =
        await this.transactionRepository.saveAndUpdateBalance(
          transaction,
          amountChange,
        );

      const balance = await this.balanceRepository.find();

      return {
        transactionId: savedTransaction.id,
        newBalance: balance!.amount,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(
        'Failed to find transactions by filters. Error: ' + errorMessage,
      );
    }
  }

  private getAmountChange(type: TransactionType, amount: number): number {
    if (
      type === TransactionType.TRANSFER_OUT ||
      type === TransactionType.WITHDRAWAL
    ) {
      return -amount;
    }
    return amount;
  }
}
