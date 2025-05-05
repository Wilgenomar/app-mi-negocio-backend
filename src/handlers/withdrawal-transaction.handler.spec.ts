/* eslint-disable @typescript-eslint/unbound-method */
import { CreateTransactionUseCase } from '../../domain/usecases/create-transaction.usecase';
import { TransactionMapper } from '../models/mappers/transaction.mapper';
import { WithdrawalAndDepositTransactionDto } from '../models/dto/withdrawal-and-deposit-transaction.dto';
import { mock, MockProxy } from 'jest-mock-extended';
import { HttpStatus } from '@nestjs/common';
import { Transaction } from '../../domain/models/entities/transaction.entity';
import { CreateTransactionResponse } from '../../domain/models/types/create-transaction-response.type';
import { TransactionType } from '../../domain/models/enums/transaction-type.enum';
import { WithdrawalTransactionHandler } from './withdrawal-transaction.handler';

describe('WithDrawalTransactionHandler', () => {
  let withdrawalTransactionHandler: WithdrawalTransactionHandler;
  let createTransactionUseCase: MockProxy<CreateTransactionUseCase>;

  beforeEach(() => {
    createTransactionUseCase = mock<CreateTransactionUseCase>();
    withdrawalTransactionHandler = new WithdrawalTransactionHandler(
      createTransactionUseCase,
    );
  });

  it('should return a valid HTTPResponse when the use case succeeds', async () => {
    const createTransactionDto: WithdrawalAndDepositTransactionDto = {
      amount: 1000,
      description: 'Test withdrawal',
    };

    const mockTransaction = new Transaction(
      TransactionType.WITHDRAWAL,
      1000,
      'Test withdrawal',
    );

    const mockResponse: CreateTransactionResponse = {
      transactionId: 1,
      newBalance: 5000,
    };

    jest
      .spyOn(TransactionMapper, 'toWithdrawalTransaction')
      .mockReturnValue(mockTransaction);
    createTransactionUseCase.execute.mockResolvedValue(mockResponse);

    const result =
      await withdrawalTransactionHandler.apply(createTransactionDto);

    expect(result).toEqual({
      code: HttpStatus.OK,
      message: 'Your withdrawal has been successfully processed',
      data: mockResponse,
    });
    expect(TransactionMapper.toWithdrawalTransaction).toHaveBeenCalledWith(
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
      description: 'Test withdrawal',
    };

    const mockTransaction = new Transaction(
      TransactionType.WITHDRAWAL,
      1000,
      'Test withdrawal',
    );

    jest
      .spyOn(TransactionMapper, 'toWithdrawalTransaction')
      .mockReturnValue(mockTransaction);
    createTransactionUseCase.execute.mockRejectedValue(
      new Error('An error occurred'),
    );

    await expect(
      withdrawalTransactionHandler.apply(createTransactionDto),
    ).rejects.toThrowError('An error occurred');
    expect(TransactionMapper.toWithdrawalTransaction).toHaveBeenCalledWith(
      createTransactionDto,
    );
    expect(createTransactionUseCase.execute).toHaveBeenCalledWith(
      mockTransaction,
    );
    expect(createTransactionUseCase.execute).toHaveBeenCalledTimes(1);
  });
});
