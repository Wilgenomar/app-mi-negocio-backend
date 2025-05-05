/* eslint-disable @typescript-eslint/unbound-method */
import { CreateTransactionUseCase } from './create-transaction.usecase';
import { ITransactionRepository } from '../interfaces/transaction-repository.interface';
import { IBalanceRepository } from '../interfaces/balance.repository.interface';
import { Transaction } from '../models/entities/transaction.entity';
import { TransactionType } from '../models/enums/transaction-type.enum';
import { mock, MockProxy } from 'jest-mock-extended';
import { Balance } from '../models/entities/balance.entity';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let transactionRepository: MockProxy<ITransactionRepository>;
  let balanceRepository: MockProxy<IBalanceRepository>;

  beforeEach(() => {
    transactionRepository = mock<ITransactionRepository>();
    balanceRepository = mock<IBalanceRepository>();
    useCase = new CreateTransactionUseCase(
      transactionRepository,
      balanceRepository,
    );
  });

  it('should create a transaction and return the response with the new balance', async () => {
    const transaction = new Transaction(
      TransactionType.IN,
      1000,
      'Savings',
      '123456',
      'John Doe',
      'ID',
      '123456789',
      'Bank A',
      new Date(),
      new Date(),
      'Test transaction',
    );

    const savedTransaction = { ...transaction, id: 1 };
    const mockBalance = new Balance(5000, new Date(), new Date());

    transactionRepository.saveAndUpdateBalance.mockResolvedValue(
      savedTransaction,
    );
    balanceRepository.find.mockResolvedValue(mockBalance);

    const result = await useCase.execute(transaction);

    expect(result).toEqual({
      transactionId: 1,
      newBalance: 5000,
    });
    expect(transactionRepository.saveAndUpdateBalance).toHaveBeenCalledWith(
      transaction,
      1000,
    );
    expect(balanceRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should handle outgoing transactions correctly and return the updated balance', async () => {
    const transaction = new Transaction(
      TransactionType.OUT,
      500,
      'Checking',
      '654321',
      'Jane Doe',
      'Passport',
      '987654321',
      'Bank B',
      new Date(),
      new Date(),
      'Another transaction',
    );

    const savedTransaction = { ...transaction, id: 2 };
    const mockBalance = new Balance(4500, new Date(), new Date());

    transactionRepository.saveAndUpdateBalance.mockResolvedValue(
      savedTransaction,
    );
    balanceRepository.find.mockResolvedValue(mockBalance);

    const result = await useCase.execute(transaction);

    expect(result).toEqual({
      transactionId: 2,
      newBalance: 4500,
    });
    expect(transactionRepository.saveAndUpdateBalance).toHaveBeenCalledWith(
      transaction,
      -500,
    );
    expect(balanceRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if saving the transaction fails', async () => {
    const transaction = new Transaction(
      TransactionType.IN,
      1000,
      'Savings',
      '123456',
      'John Doe',
      'ID',
      '123456789',
      'Bank A',
      new Date(),
      new Date(),
      'Test transaction',
    );

    transactionRepository.saveAndUpdateBalance.mockRejectedValue(
      new Error('Save failed'),
    );

    await expect(useCase.execute(transaction)).rejects.toThrowError(
      'Failed to find transactions by filters. Error: Save failed',
    );
    expect(transactionRepository.saveAndUpdateBalance).toHaveBeenCalledWith(
      transaction,
      1000,
    );
    expect(balanceRepository.find).not.toHaveBeenCalled();
  });

  it('should throw an error if retrieving the balance fails', async () => {
    const transaction = new Transaction(
      TransactionType.IN,
      1000,
      'Savings',
      '123456',
      'John Doe',
      'ID',
      '123456789',
      'Bank A',
      new Date(),
      new Date(),
      'Test transaction',
    );

    const savedTransaction = { ...transaction, id: 1 };

    transactionRepository.saveAndUpdateBalance.mockResolvedValue(
      savedTransaction,
    );
    balanceRepository.find.mockRejectedValue(
      new Error('Balance retrieval failed'),
    );

    await expect(useCase.execute(transaction)).rejects.toThrowError(
      'Failed to find transactions by filters. Error: Balance retrieval failed',
    );
    expect(transactionRepository.saveAndUpdateBalance).toHaveBeenCalledWith(
      transaction,
      1000,
    );
    expect(balanceRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should throw an error with a generic message for unknown errors', async () => {
    const transaction = new Transaction(
      TransactionType.IN,
      1000,
      'Savings',
      '123456',
      'John Doe',
      'ID',
      '123456789',
      'Bank A',
      new Date(),
      new Date(),
      'Test transaction',
    );

    transactionRepository.saveAndUpdateBalance.mockRejectedValue(
      'Unknown error',
    );

    await expect(useCase.execute(transaction)).rejects.toThrowError(
      'Failed to find transactions by filters. Error: Unknown error',
    );
    expect(transactionRepository.saveAndUpdateBalance).toHaveBeenCalledWith(
      transaction,
      1000,
    );
    expect(balanceRepository.find).not.toHaveBeenCalled();
  });
});
