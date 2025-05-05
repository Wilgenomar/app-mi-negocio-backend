/* eslint-disable @typescript-eslint/unbound-method */
import { FindTransactionsByFiltersUseCase } from './find-transactions-by-filters.usecase';
import { ITransactionRepository } from 'domain/interfaces/transaction-repository.interface';
import { FindTransactionsByFilterCommand } from 'domain/models/commands/find-transactions-by-filter.command';
import { Transaction } from 'domain/models/entities/transaction.entity';
import { mock, MockProxy } from 'jest-mock-extended';
import { TransactionType } from '../models/enums/transaction-type.enum';

describe('FindTransactionsByFiltersUseCase', () => {
  let useCase: FindTransactionsByFiltersUseCase;
  let transactionRepository: MockProxy<ITransactionRepository>;

  beforeEach(() => {
    transactionRepository = mock<ITransactionRepository>();
    useCase = new FindTransactionsByFiltersUseCase(transactionRepository);
  });

  it('should return transactions when the repository succeeds', async () => {
    const command: FindTransactionsByFilterCommand = {
      limit: 10,
      page: 1,
      fromDate: new Date('2023-01-01'),
      toDate: new Date('2023-01-31'),
      type: TransactionType.IN,
    };

    const mockTransactions: Transaction[] = [
      {
        id: 1,
        amount: 100,
        type: TransactionType.IN,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        documentNumber: '123456789',
        description: 'Test transaction 1',
        documentType: 'Invoice',
        bank: 'Bank A',
        accountNumber: '1234567890',
        accountType: 'Savings',
        name: 'John Doe',
      },
    ];

    transactionRepository.find.mockResolvedValue(mockTransactions);

    const result = await useCase.execute(command);

    expect(result).toEqual(mockTransactions);
    expect(transactionRepository.find).toHaveBeenCalledWith(command);
    expect(transactionRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the repository throws an exception', async () => {
    const command: FindTransactionsByFilterCommand = {
      limit: 10,
      page: 1,
      fromDate: new Date('2023-01-01'),
      toDate: new Date('2023-01-31'),
      type: TransactionType.IN,
    };

    transactionRepository.find.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute(command)).rejects.toThrowError(
      'Failed to find transactions by filters. Error: Database error',
    );
    expect(transactionRepository.find).toHaveBeenCalledWith(command);
    expect(transactionRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should throw an error with a generic message when an unknown error occurs', async () => {
    const command: FindTransactionsByFilterCommand = {
      limit: 10,
      page: 1,
      fromDate: new Date('2023-01-01'),
      toDate: new Date('2023-01-31'),
      type: TransactionType.IN,
    };

    transactionRepository.find.mockRejectedValue('Unknown error');

    await expect(useCase.execute(command)).rejects.toThrowError(
      'Failed to find transactions by filters. Error: Unknown error',
    );
    expect(transactionRepository.find).toHaveBeenCalledWith(command);
    expect(transactionRepository.find).toHaveBeenCalledTimes(1);
  });
});
