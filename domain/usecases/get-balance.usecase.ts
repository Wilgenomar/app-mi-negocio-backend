import { IBalanceRepository } from 'domain/interfaces/balance.repository.interface';
import { Balance } from 'domain/models/entities/balance.entity';

export class GetBalanceUseCase {
  constructor(private readonly balanceRepository: IBalanceRepository) {}

  async execute(): Promise<Balance> {
    try {
      const balance = await this.balanceRepository.find();

      if (!balance) {
        throw new Error('The record for the entity Balance does not exist.');
      }

      return balance;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(
        'An error occurred while fetching the balance. Error: ' + errorMessage,
      );
    }
  }
}
