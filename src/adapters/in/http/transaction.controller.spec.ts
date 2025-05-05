/* eslint-disable @typescript-eslint/unbound-method */
import { TransactionController } from './transaction.controller';
import { FindTransactionsByFiltersHandler } from '../../../handlers/find-transactions-by-filters.handler';
import { FindTransactionsByFiltersDto } from 'src/models/dto/find-transactions-by-filters.dto';
import { PaginationQueryDto } from 'src/models/dto/pagination-query.dto';
import { HTTPResponse } from 'src/models/type/http-response';
import { mock, MockProxy } from 'jest-mock-extended';
import { HttpStatus } from '@nestjs/common';
import { TransactionType } from '../../../../domain/models/enums/transaction-type.enum';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let findTransactionsByFiltersHandler: MockProxy<FindTransactionsByFiltersHandler>;

  beforeEach(() => {
    findTransactionsByFiltersHandler = mock<FindTransactionsByFiltersHandler>();
    transactionController = new TransactionController(
      findTransactionsByFiltersHandler,
    );
  });

  it('should return a valid HTTPResponse when the handler succeeds', async () => {
    const filters: FindTransactionsByFiltersDto = {
      fromDate: '2023-01-01',
      toDate: '2023-01-31',
      type: TransactionType.IN,
    };
    const pagination: PaginationQueryDto = {
      limit: 10,
      page: 1,
    };
    const mockResponse: HTTPResponse = {
      code: HttpStatus.OK,
      message: 'Transactions retrieved successfully',
      data: [
        {
          id: 1,
          amount: 100,
          type: TransactionType.IN,
          date: new Date('2023-01-01'),
        },
      ],
    };

    findTransactionsByFiltersHandler.apply.mockResolvedValue(mockResponse);

    const result = await transactionController.list(filters, pagination);

    expect(result).toEqual(mockResponse);
    expect(findTransactionsByFiltersHandler.apply).toHaveBeenCalledWith(
      filters,
      pagination,
    );
    expect(findTransactionsByFiltersHandler.apply).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the handler throws an exception', async () => {
    const filters: FindTransactionsByFiltersDto = {
      fromDate: '2023-01-01',
      toDate: '2023-01-31',
      type: TransactionType.OUT,
    };
    const pagination: PaginationQueryDto = {
      limit: 10,
      page: 1,
    };
    const errorMessage = 'An error occurred';

    findTransactionsByFiltersHandler.apply.mockRejectedValue(
      new Error(errorMessage),
    );

    await expect(
      transactionController.list(filters, pagination),
    ).rejects.toThrowError(errorMessage);
    expect(findTransactionsByFiltersHandler.apply).toHaveBeenCalledWith(
      filters,
      pagination,
    );
    expect(findTransactionsByFiltersHandler.apply).toHaveBeenCalledTimes(1);
  });
});
