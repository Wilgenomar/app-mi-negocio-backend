import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { FindTransactionsByFiltersDto } from '../dto/find-transactions-by-filters.dto';
import { TransactionType } from '../../../domain/models/enums/transaction-type.enum';
import { TransactionMapper } from './transaction.mapper';

describe('TransactionMapper', () => {
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
