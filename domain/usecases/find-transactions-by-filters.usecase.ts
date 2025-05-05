import { ITransactionRepository } from 'domain/interfaces/transaction-repository.interface';
import { FindTransactionsByFilterCommand } from 'domain/models/commands/find-transactions-by-filter.command';
import { Transaction } from 'domain/models/entities/transaction.entity';

export class FindTransactionsByFiltersUseCase {
  constructor(private readonly repo: ITransactionRepository) {}

  async execute(
    command: FindTransactionsByFilterCommand,
  ): Promise<Transaction[]> {
    try {
      return await this.repo.find(command);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(
        'Failed to find transactions by filters. Error: ' + errorMessage,
      );
    }
  }
}
