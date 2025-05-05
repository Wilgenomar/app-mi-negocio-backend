/* eslint-disable @typescript-eslint/unbound-method */
import { TransactionRepository } from './transaction.repository';
import { EntityManager, Between, FindOptionsWhere } from 'typeorm';
import { mock, MockProxy } from 'jest-mock-extended';
import { FindTransactionsByFilterCommand } from '../../../../domain/models/commands/find-transactions-by-filter.command';
import { Transaction } from '../../../../domain/models/entities/transaction.entity';
import { TransactionType } from '../../../../domain/models/enums/transaction-type.enum';

describe('TransactionRepository', () => {
  let transactionRepository: TransactionRepository;
  let entityManager: MockProxy<EntityManager>;

  beforeEach(() => {
    entityManager = mock<EntityManager>();
    transactionRepository = new TransactionRepository(entityManager);
  });

  it('should return transactions when filters are applied', async () => {
    const filters: FindTransactionsByFilterCommand = {
      limit: 10,
      page: 1,
      fromDate: new Date('2023-01-01'),
      toDate: new Date('2023-01-31'),
      type: TransactionType.IN,
    };

    const mockTransactions: Transaction[] = [
      new Transaction(
        TransactionType.IN,
        100,
        'Savings',
        '123456',
        'John Doe',
        'ID',
        '123456789',
        'Bank A',
        new Date('2023-01-01'),
        new Date('2023-01-01'),
        'Test transaction',
      ),
    ];

    entityManager.find.mockResolvedValue(mockTransactions);

    const result = await transactionRepository.find(filters);

    expect(result).toEqual(mockTransactions);
    expect(entityManager.find).toHaveBeenCalledWith(Transaction, {
      where: {
        createdAt: Between(filters.fromDate, filters.toDate),
        type: TransactionType.IN,
      } as FindOptionsWhere<Transaction>,
      order: { createdAt: 'DESC' },
      skip: 0,
      take: 10,
    });
  });

  it('should return transactions when only pagination is applied', async () => {
    const filters: FindTransactionsByFilterCommand = {
      limit: 5,
      page: 2,
    };

    const mockTransactions: Transaction[] = [
      new Transaction(
        TransactionType.OUT,
        200,
        'Checking',
        '654321',
        'Jane Doe',
        'Passport',
        '987654321',
        'Bank B',
        new Date('2023-02-01'),
        new Date('2023-02-01'),
        'Another transaction',
      ),
    ];

    entityManager.find.mockResolvedValue(mockTransactions);

    const result = await transactionRepository.find(filters);

    expect(result).toEqual(mockTransactions);
    expect(entityManager.find).toHaveBeenCalledWith(Transaction, {
      where: {},
      order: { createdAt: 'DESC' },
      skip: 5,
      take: 5,
    });
  });

  it('should return transactions when no filters are applied', async () => {
    const filters: FindTransactionsByFilterCommand = {
      limit: 10,
      page: 1,
    };

    const mockTransactions: Transaction[] = [
      new Transaction(
        TransactionType.IN,
        300,
        'Savings',
        '789012',
        'Alice Smith',
        'Driver License',
        '456789123',
        'Bank C',
        new Date('2023-03-01'),
        new Date('2023-03-01'),
        'Sample transaction',
      ),
    ];

    entityManager.find.mockResolvedValue(mockTransactions);

    const result = await transactionRepository.find(filters);

    expect(result).toEqual(mockTransactions);
    expect(entityManager.find).toHaveBeenCalledWith(Transaction, {
      where: {},
      order: { createdAt: 'DESC' },
      skip: 0,
      take: 10,
    });
  });

  it('should handle empty result set', async () => {
    const filters: FindTransactionsByFilterCommand = {
      limit: 10,
      page: 1,
    };

    entityManager.find.mockResolvedValue([]);

    const result = await transactionRepository.find(filters);

    expect(result).toEqual([]);
    expect(entityManager.find).toHaveBeenCalledWith(Transaction, {
      where: {},
      order: { createdAt: 'DESC' },
      skip: 0,
      take: 10,
    });
  });

  it('should throw an error when entityManager.find fails', async () => {
    const filters: FindTransactionsByFilterCommand = {
      limit: 10,
      page: 1,
    };

    entityManager.find.mockRejectedValue(new Error('Database error'));

    await expect(transactionRepository.find(filters)).rejects.toThrowError(
      'Database error',
    );
    expect(entityManager.find).toHaveBeenCalledWith(Transaction, {
      where: {},
      order: { createdAt: 'DESC' },
      skip: 0,
      take: 10,
    });
  });
});
