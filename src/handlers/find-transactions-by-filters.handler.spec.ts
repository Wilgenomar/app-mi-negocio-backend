/* eslint-disable @typescript-eslint/unbound-method */
import { FindTransactionsByFiltersHandler } from './find-transactions-by-filters.handler';
import { FindTransactionsByFiltersUseCase } from 'domain/usecases/find-transactions-by-filters.usecase';
import { FindTransactionsByFiltersDto } from '../models/dto/find-transactions-by-filters.dto';
import { PaginationQueryDto } from '../models/dto/pagination-query.dto';
import { TransactionMapper } from '../models/mappers/transaction.mapper';
import { HTTPResponse } from '../models/type/http-response';
import { mock, MockProxy } from 'jest-mock-extended';
import { HttpStatus } from '@nestjs/common';
import { Transaction } from '../../domain/models/entities/transaction.entity';
import { TransactionType } from '../../domain/models/enums/transaction-type.enum';

describe('FindTransactionsByFiltersHandler', () => {
  let handler: FindTransactionsByFiltersHandler;
  let useCase: MockProxy<FindTransactionsByFiltersUseCase>;

  beforeEach(() => {
    useCase = mock<FindTransactionsByFiltersUseCase>();
    handler = new FindTransactionsByFiltersHandler(useCase);
  });

  it('should return a valid HTTPResponse when the use case succeeds', async () => {
    const filters: FindTransactionsByFiltersDto = {
      fromDate: '2023-01-01',
      toDate: '2023-01-31',
      type: TransactionType.TRANSFER_IN,
    };
    const pagination: PaginationQueryDto = {
      limit: 10,
      page: 1,
    };
    const mockTransactions: Transaction[] = [
      {
        id: 1,
        amount: 100,
        type: TransactionType.TRANSFER_IN,
        accountNumber: '123456789',
        description: 'Test transaction',
        accountType: 'SAVINGS',
        name: 'John Doe',
        documentType: 'ID',
        documentNumber: '987654321',
        bank: 'Test Bank',
        updatedAt: new Date('2023-01-01'),
        createdAt: new Date('2023-01-01'),
      },
    ];
    const expectedResponse: HTTPResponse = {
      code: HttpStatus.OK,
      message: 'Transactions retrieved successfully',
      data: mockTransactions,
    };

    jest.spyOn(TransactionMapper, 'toUseCaseCommand').mockReturnValue({
      limit: 10,
      page: 1,
      fromDate: new Date('2023-01-01'),
      toDate: new Date('2023-01-31'),
      type: TransactionType.TRANSFER_IN,
    });
    useCase.execute.mockResolvedValue(mockTransactions);

    const result = await handler.apply(filters, pagination);

    expect(result).toEqual(expectedResponse);
    expect(TransactionMapper.toUseCaseCommand).toHaveBeenCalledWith(
      filters,
      pagination,
    );
    expect(useCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the use case throws an exception', async () => {
    const filters: FindTransactionsByFiltersDto = {
      fromDate: '2023-01-01',
      toDate: '2023-01-31',
      type: TransactionType.TRANSFER_IN,
    };
    const pagination: PaginationQueryDto = {
      limit: 10,
      page: 1,
    };
    const errorMessage = 'An error occurred';

    jest.spyOn(TransactionMapper, 'toUseCaseCommand').mockReturnValue({
      limit: 10,
      page: 1,
      fromDate: new Date('2023-01-01'),
      toDate: new Date('2023-01-31'),
      type: TransactionType.TRANSFER_IN,
    });
    useCase.execute.mockRejectedValue(new Error(errorMessage));

    await expect(handler.apply(filters, pagination)).rejects.toThrowError(
      errorMessage,
    );
    expect(TransactionMapper.toUseCaseCommand).toHaveBeenCalledWith(
      filters,
      pagination,
    );
    expect(useCase.execute).toHaveBeenCalledTimes(1);
  });
});
