/* eslint-disable @typescript-eslint/unbound-method */
import { ReceiveTransactionHandler } from './receive-transaction.handler';
import { CreateTransactionUseCase } from '../../domain/usecases/create-transaction.usecase';
import { TransactionMapper } from '../models/mappers/transaction.mapper';
import { CreateTransactionDto } from '../models/dto/create-transaction.dto';
import { mock, MockProxy } from 'jest-mock-extended';
import { HttpStatus } from '@nestjs/common';
import { Transaction } from '../../domain/models/entities/transaction.entity';
import { CreateTransactionResponse } from '../../domain/models/types/create-transaction-response.type';
import { TransactionType } from '../../domain/models/enums/transaction-type.enum';

describe('ReceiveTransactionHandler', () => {
  let receiveTransactionHandler: ReceiveTransactionHandler;
  let createTransactionUseCase: MockProxy<CreateTransactionUseCase>;

  beforeEach(() => {
    createTransactionUseCase = mock<CreateTransactionUseCase>();
    receiveTransactionHandler = new ReceiveTransactionHandler(
      createTransactionUseCase,
    );
  });

  it('should return a valid HTTPResponse when the use case succeeds', async () => {
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

    const mockTransaction = new Transaction(
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

    const mockResponse: CreateTransactionResponse = {
      transactionId: 1,
      newBalance: 5000,
    };

    jest
      .spyOn(TransactionMapper, 'toReceiveTransaction')
      .mockReturnValue(mockTransaction);
    createTransactionUseCase.execute.mockResolvedValue(mockResponse);

    const result = await receiveTransactionHandler.apply(createTransactionDto);

    expect(result).toEqual({
      code: HttpStatus.OK,
      message: 'Transactions retrieved successfully',
      data: mockResponse,
    });
    expect(TransactionMapper.toReceiveTransaction).toHaveBeenCalledWith(
      createTransactionDto,
    );
    expect(createTransactionUseCase.execute).toHaveBeenCalledWith(
      mockTransaction,
    );
    expect(createTransactionUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the use case throws an exception', async () => {
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

    const mockTransaction = new Transaction(
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

    jest
      .spyOn(TransactionMapper, 'toReceiveTransaction')
      .mockReturnValue(mockTransaction);
    createTransactionUseCase.execute.mockRejectedValue(
      new Error('An error occurred'),
    );

    await expect(
      receiveTransactionHandler.apply(createTransactionDto),
    ).rejects.toThrowError('An error occurred');
    expect(TransactionMapper.toReceiveTransaction).toHaveBeenCalledWith(
      createTransactionDto,
    );
    expect(createTransactionUseCase.execute).toHaveBeenCalledWith(
      mockTransaction,
    );
    expect(createTransactionUseCase.execute).toHaveBeenCalledTimes(1);
  });
});
