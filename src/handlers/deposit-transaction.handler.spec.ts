/* eslint-disable @typescript-eslint/unbound-method */
import { DepositTransactionHandler } from './deposit-transaction.handler';
import { CreateTransactionUseCase } from '../../domain/usecases/create-transaction.usecase';
import { TransactionMapper } from '../models/mappers/transaction.mapper';
import { WithdrawalAndDepositTransactionDto } from '../models/dto/withdrawal-and-deposit-transaction.dto';
import { mock, MockProxy } from 'jest-mock-extended';
import { HttpStatus } from '@nestjs/common';
import { Transaction } from '../../domain/models/entities/transaction.entity';
import { CreateTransactionResponse } from '../../domain/models/types/create-transaction-response.type';
import { TransactionType } from '../../domain/models/enums/transaction-type.enum';

describe('DepositTransactionHandler', () => {
  let depositTransactionHandler: DepositTransactionHandler;
  let createTransactionUseCase: MockProxy<CreateTransactionUseCase>;

  beforeEach(() => {
    createTransactionUseCase = mock<CreateTransactionUseCase>();
    depositTransactionHandler = new DepositTransactionHandler(
      createTransactionUseCase,
    );
  });

  it('should return a valid HTTPResponse when the use case succeeds', async () => {
    const createTransactionDto: WithdrawalAndDepositTransactionDto = {
      amount: 1000,
      description: 'Test deposit',
    };

    const mockTransaction = new Transaction(
      TransactionType.DEPOSIT,
      1000,
      'Test deposit',
    );

    const mockResponse: CreateTransactionResponse = {
      transactionId: 1,
      newBalance: 5000,
    };

    jest
      .spyOn(TransactionMapper, 'toDepositTransaction')
      .mockReturnValue(mockTransaction);
    createTransactionUseCase.execute.mockResolvedValue(mockResponse);

    const result = await depositTransactionHandler.apply(createTransactionDto);

    expect(result).toEqual({
      code: HttpStatus.OK,
      message: 'Your deposit has been successfully processed',
      data: mockResponse,
    });
    expect(TransactionMapper.toDepositTransaction).toHaveBeenCalledWith(
      createTransactionDto,
    );
    expect(createTransactionUseCase.execute).toHaveBeenCalledWith(
      mockTransaction,
    );
    expect(createTransactionUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the use case throws an exception', async () => {
    const createTransactionDto: WithdrawalAndDepositTransactionDto = {
      amount: 1000,
      description: 'Test deposit',
    };

    const mockTransaction = new Transaction(
      TransactionType.DEPOSIT,
      1000,
      'Test deposit',
    );

    jest
      .spyOn(TransactionMapper, 'toDepositTransaction')
      .mockReturnValue(mockTransaction);
    createTransactionUseCase.execute.mockRejectedValue(
      new Error('An error occurred'),
    );

    await expect(
      depositTransactionHandler.apply(createTransactionDto),
    ).rejects.toThrowError('An error occurred');
    expect(TransactionMapper.toDepositTransaction).toHaveBeenCalledWith(
      createTransactionDto,
    );
    expect(createTransactionUseCase.execute).toHaveBeenCalledWith(
      mockTransaction,
    );
    expect(createTransactionUseCase.execute).toHaveBeenCalledTimes(1);
  });
});
