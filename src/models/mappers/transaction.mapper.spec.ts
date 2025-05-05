import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { FindTransactionsByFiltersDto } from '../dto/find-transactions-by-filters.dto';
import { TransactionType } from '../../../domain/models/enums/transaction-type.enum';
import { TransactionMapper } from './transaction.mapper';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction } from '../../../domain/models/entities/transaction.entity';

describe('TransactionMapper', () => {
  describe('toUseCaseCommand', () => {
    it('should map filters and pagination to a use case command with all fields', () => {
      const filters: FindTransactionsByFiltersDto = {
        fromDate: '2023-01-01',
        toDate: '2023-01-31',
        type: TransactionType.IN,
      };
      const pagination: PaginationQueryDto = {
        limit: 10,
        page: 2,
      };

      const result = TransactionMapper.toUseCaseCommand(filters, pagination);

      expect(result).toEqual({
        limit: 10,
        page: 2,
        fromDate: new Date('2023-01-01'),
        toDate: new Date('2023-01-31'),
        type: TransactionType.IN,
      });
    });

    it('should map filters and pagination to a use case command with optional fields undefined', () => {
      const filters: FindTransactionsByFiltersDto = {};
      const pagination: PaginationQueryDto = {
        limit: 10,
        page: 1,
      };

      const result = TransactionMapper.toUseCaseCommand(filters, pagination);

      expect(result).toEqual({
        limit: 10,
        page: 1,
        fromDate: undefined,
        toDate: undefined,
        type: undefined,
      });
    });

    it('should use default values for pagination when not provided', () => {
      const filters: FindTransactionsByFiltersDto = {
        fromDate: '2023-01-01',
        toDate: '2023-01-31',
        type: TransactionType.OUT,
      };
      const pagination: PaginationQueryDto = {};

      const result = TransactionMapper.toUseCaseCommand(filters, pagination);

      expect(result).toEqual({
        limit: 10,
        page: 1,
        fromDate: new Date('2023-01-01'),
        toDate: new Date('2023-01-31'),
        type: TransactionType.OUT,
      });
    });
  });

  describe('toReceiveTransaction', () => {
    it('should map CreateTransactionDto to a Transaction entity', () => {
      const createTransactionDto: CreateTransactionDto = {
        amount: 1000,
        accountType: 'Savings',
        accountNumber: '123456',
        name: 'John Doe',
        documentType: 'ID',
        documentNumber: '123456789',
        bank: 'Bank A',
        description: 'Test transaction',
      };

      const result =
        TransactionMapper.toReceiveTransaction(createTransactionDto);

      expect(result).toBeInstanceOf(Transaction);
      expect(result.amount).toEqual(1000);
      expect(result.accountType).toEqual('Savings');
      expect(result.accountNumber).toEqual('123456');
      expect(result.name).toEqual('John Doe');
      expect(result.documentType).toEqual('ID');
      expect(result.documentNumber).toEqual('123456789');
      expect(result.bank).toEqual('Bank A');
      expect(result.description).toEqual('Test transaction');
      expect(result.type).toEqual(TransactionType.IN);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should map CreateTransactionDto to a Transaction entity with optional description undefined', () => {
      const createTransactionDto: CreateTransactionDto = {
        amount: 1500,
        accountType: 'Checking',
        accountNumber: '654321',
        name: 'Jane Doe',
        documentType: 'Passport',
        documentNumber: '987654321',
        bank: 'Bank B',
      };

      const result =
        TransactionMapper.toReceiveTransaction(createTransactionDto);

      expect(result).toBeInstanceOf(Transaction);
      expect(result.amount).toEqual(1500);
      expect(result.accountType).toEqual('Checking');
      expect(result.accountNumber).toEqual('654321');
      expect(result.name).toEqual('Jane Doe');
      expect(result.documentType).toEqual('Passport');
      expect(result.documentNumber).toEqual('987654321');
      expect(result.bank).toEqual('Bank B');
      expect(result.description).toBeUndefined();
      expect(result.type).toEqual(TransactionType.IN);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });
});
