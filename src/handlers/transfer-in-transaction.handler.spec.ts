/* eslint-disable @typescript-eslint/unbound-method */
import { TransferInTransactionHandler } from './transfer-in-transaction.handler';
import { CreateTransactionUseCase } from '../../domain/usecases/create-transaction.usecase';
import { TransactionMapper } from '../models/mappers/transaction.mapper';
import { mock, MockProxy } from 'jest-mock-extended';
import { HttpStatus } from '@nestjs/common';
import { Transaction } from '../../domain/models/entities/transaction.entity';
import { CreateTransactionResponse } from '../../domain/models/types/create-transaction-response.type';
import { TransactionType } from '../../domain/models/enums/transaction-type.enum';
import { CreateTransferTransactionDto } from 'src/models/dto/create-transfer-transaction.dto';

describe('TransferInTransactionHandler', () => {
  let transferInTransactionHandler: TransferInTransactionHandler;
  let createTransactionUseCase: MockProxy<CreateTransactionUseCase>;

  beforeEach(() => {
    createTransactionUseCase = mock<CreateTransactionUseCase>();
    transferInTransactionHandler = new TransferInTransactionHandler(
      createTransactionUseCase,
    );
  });

  it('should return a valid HTTPResponse when the use case succeeds', async () => {
    const createTransactionDto: CreateTransferTransactionDto = {
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
      TransactionType.TRANSFER_IN,
      1000,
      'Test transaction',
      'Savings',
      '123456',
      'John Doe',
      'ID',
      '123456789',
      'Bank A',
      new Date(),
      new Date(),
    );

    const mockResponse: CreateTransactionResponse = {
      transactionId: 1,
      newBalance: 5000,
    };

    jest
      .spyOn(TransactionMapper, 'toTransferInTransaction')
      .mockReturnValue(mockTransaction);
    createTransactionUseCase.execute.mockResolvedValue(mockResponse);

    const result =
      await transferInTransactionHandler.apply(createTransactionDto);

    expect(result).toEqual({
      code: HttpStatus.OK,
      message: 'The inbound transfer has been successfully processed.',
      data: mockResponse,
    });
    expect(TransactionMapper.toTransferInTransaction).toHaveBeenCalledWith(
      createTransactionDto,
    );
    expect(createTransactionUseCase.execute).toHaveBeenCalledWith(
      mockTransaction,
    );
    expect(createTransactionUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the use case throws an exception', async () => {
    const createTransactionDto: CreateTransferTransactionDto = {
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
      TransactionType.TRANSFER_IN,
      1000,
      'Test transaction',
      'Savings',
      '123456',
      'John Doe',
      'ID',
      '123456789',
      'Bank A',
      new Date(),
      new Date(),
    );

    jest
      .spyOn(TransactionMapper, 'toTransferInTransaction')
      .mockReturnValue(mockTransaction);
    createTransactionUseCase.execute.mockRejectedValue(
      new Error('An error occurred'),
    );

    await expect(
      transferInTransactionHandler.apply(createTransactionDto),
    ).rejects.toThrowError('An error occurred');
    expect(TransactionMapper.toTransferInTransaction).toHaveBeenCalledWith(
      createTransactionDto,
    );
    expect(createTransactionUseCase.execute).toHaveBeenCalledWith(
      mockTransaction,
    );
    expect(createTransactionUseCase.execute).toHaveBeenCalledTimes(1);
  });
});
