/* eslint-disable @typescript-eslint/unbound-method */
import { TransactionController } from './transaction.controller';
import { FindTransactionsByFiltersHandler } from '../../../handlers/find-transactions-by-filters.handler';
import { ReceiveTransactionHandler } from '../../../handlers/receive-transaction.handler';
import { FindTransactionsByFiltersDto } from '../../../models/dto/find-transactions-by-filters.dto';
import { PaginationQueryDto } from '../../../models/dto/pagination-query.dto';
import { CreateTransactionDto } from '../../../models/dto/create-transaction.dto';
import { HTTPResponse } from '../../../models/type/http-response';
import { mock, MockProxy } from 'jest-mock-extended';
import { HttpStatus } from '@nestjs/common';
import { TransactionType } from '../../../../domain/models/enums/transaction-type.enum';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let findTransactionsByFiltersHandler: MockProxy<FindTransactionsByFiltersHandler>;
  let receiveTransactionHandler: MockProxy<ReceiveTransactionHandler>;

  beforeEach(() => {
    findTransactionsByFiltersHandler = mock<FindTransactionsByFiltersHandler>();
    receiveTransactionHandler = mock<ReceiveTransactionHandler>();
    transactionController = new TransactionController(
      findTransactionsByFiltersHandler,
      receiveTransactionHandler,
    );
  });

  it('should return a valid HTTPResponse when the list handler succeeds', async () => {
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

  it('should throw an error when the list handler throws an exception', async () => {
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

  it('should return a valid HTTPResponse when the receive handler succeeds', async () => {
    const createTransactionDto: CreateTransactionDto = {
      amount: 100,
      accountType: 'Savings',
      accountNumber: '123456',
      name: 'John Doe',
      documentType: 'ID',
      documentNumber: '123456789',
      bank: 'Bank A',
      description: 'Test transaction',
    };
    const mockResponse: HTTPResponse = {
      code: HttpStatus.OK,
      message: 'Transactions retrieved successfully',
      data: {
        id: 1,
        amount: 100,
        type: TransactionType.IN,
        date: new Date('2023-01-01'),
      },
    };

    receiveTransactionHandler.apply.mockResolvedValue(mockResponse);

    const result = await transactionController.create(createTransactionDto);

    expect(result).toEqual(mockResponse);
    expect(receiveTransactionHandler.apply).toHaveBeenCalledWith(
      createTransactionDto,
    );
    expect(receiveTransactionHandler.apply).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the receive handler throws an exception', async () => {
    const createTransactionDto: CreateTransactionDto = {
      amount: 100,
      accountType: 'Savings',
      accountNumber: '123456',
      name: 'John Doe',
      documentType: 'ID',
      documentNumber: '123456789',
      bank: 'Bank A',
      description: 'Test transaction',
    };
    const errorMessage = 'An error occurred';

    receiveTransactionHandler.apply.mockRejectedValue(new Error(errorMessage));

    await expect(
      transactionController.create(createTransactionDto),
    ).rejects.toThrowError(errorMessage);
    expect(receiveTransactionHandler.apply).toHaveBeenCalledWith(
      createTransactionDto,
    );
    expect(receiveTransactionHandler.apply).toHaveBeenCalledTimes(1);
  });
});
