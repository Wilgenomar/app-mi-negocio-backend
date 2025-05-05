/* eslint-disable @typescript-eslint/unbound-method */
import { TransactionController } from './transaction.controller';
import { FindTransactionsByFiltersHandler } from '../../../handlers/find-transactions-by-filters.handler';
import { FindTransactionsByFiltersDto } from '../../../models/dto/find-transactions-by-filters.dto';
import { PaginationQueryDto } from '../../../models/dto/pagination-query.dto';
import { HTTPResponse } from '../../../models/type/http-response';
import { mock, MockProxy } from 'jest-mock-extended';
import { HttpStatus } from '@nestjs/common';
import { TransactionType } from '../../../../domain/models/enums/transaction-type.enum';
import { TransferOutTransactionHandler } from 'src/handlers/transfer-out-transaction.handler';
import { WithdrawalTransactionHandler } from 'src/handlers/withdrawal-transaction.handler';
import { DepositTransactionHandler } from 'src/handlers/deposit-transaction.handler';
import { TransferInTransactionHandler } from 'src/handlers/transfer-in-transaction.handler';
import { CreateTransferTransactionDto } from 'src/models/dto/create-transfer-transaction.dto';
import { WithdrawalAndDepositTransactionDto } from 'src/models/dto/withdrawal-and-deposit-transaction.dto';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let findTransactionsByFiltersHandler: MockProxy<FindTransactionsByFiltersHandler>;
  let transferInTransactionHandler: MockProxy<TransferInTransactionHandler>;
  let transferOutTransactionHandler: MockProxy<TransferOutTransactionHandler>;
  let withdrawalTransactionHandler: MockProxy<WithdrawalTransactionHandler>;
  let depositTransactionHandler: MockProxy<DepositTransactionHandler>;

  beforeEach(() => {
    findTransactionsByFiltersHandler = mock<FindTransactionsByFiltersHandler>();
    transferInTransactionHandler = mock<TransferInTransactionHandler>();
    transferOutTransactionHandler = mock<TransferOutTransactionHandler>();
    withdrawalTransactionHandler = mock<WithdrawalTransactionHandler>();
    depositTransactionHandler = mock<DepositTransactionHandler>();

    transactionController = new TransactionController(
      findTransactionsByFiltersHandler,
      transferInTransactionHandler,
      transferOutTransactionHandler,
      withdrawalTransactionHandler,
      depositTransactionHandler,
    );
  });

  describe('list', () => {
    it('should return a valid HTTPResponse when the list handler succeeds', async () => {
      const filters: FindTransactionsByFiltersDto = {
        fromDate: '2023-01-01',
        toDate: '2023-01-31',
        type: TransactionType.TRANSFER_IN,
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
            type: TransactionType.TRANSFER_IN,
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
        type: TransactionType.TRANSFER_IN,
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
      const createTransactionDto: CreateTransferTransactionDto = {
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
          type: TransactionType.TRANSFER_IN,
          date: new Date('2023-01-01'),
        },
      };

      transferInTransactionHandler.apply.mockResolvedValue(mockResponse);

      const result =
        await transactionController.createTransferInTransaction(
          createTransactionDto,
        );

      expect(result).toEqual(mockResponse);
      expect(transferInTransactionHandler.apply).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(transferInTransactionHandler.apply).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the receive handler throws an exception', async () => {
      const createTransactionDto: CreateTransferTransactionDto = {
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

      transferInTransactionHandler.apply.mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(
        transactionController.createTransferInTransaction(createTransactionDto),
      ).rejects.toThrowError(errorMessage);
      expect(transferInTransactionHandler.apply).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(transferInTransactionHandler.apply).toHaveBeenCalledTimes(1);
    });
  });

  describe('createTransferInTransaction', () => {
    it('should return a valid HTTPResponse when the handler succeeds', async () => {
      const createTransactionDto: CreateTransferTransactionDto = {
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
        message: 'The inbound transfer has been successfully processed.',
        data: {
          id: 1,
          amount: 100,
          type: TransactionType.TRANSFER_IN,
          date: new Date('2023-01-01'),
        },
      };

      transferInTransactionHandler.apply.mockResolvedValue(mockResponse);

      const result =
        await transactionController.createTransferInTransaction(
          createTransactionDto,
        );

      expect(result).toEqual(mockResponse);
      expect(transferInTransactionHandler.apply).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(transferInTransactionHandler.apply).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the handler throws an exception', async () => {
      const createTransactionDto: CreateTransferTransactionDto = {
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

      transferInTransactionHandler.apply.mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(
        transactionController.createTransferInTransaction(createTransactionDto),
      ).rejects.toThrowError(errorMessage);
      expect(transferInTransactionHandler.apply).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(transferInTransactionHandler.apply).toHaveBeenCalledTimes(1);
    });
  });

  describe('createTransferOutTransaction', () => {
    it('should return a valid HTTPResponse when the handler succeeds', async () => {
      const createTransactionDto: CreateTransferTransactionDto = {
        amount: 200,
        accountType: 'Checking',
        accountNumber: '654321',
        name: 'Jane Doe',
        documentType: 'Passport',
        documentNumber: '987654321',
        bank: 'Bank B',
        description: 'Test transfer out',
      };
      const mockResponse: HTTPResponse = {
        code: HttpStatus.OK,
        message: 'The outbound transfer has been successfully processed.',
        data: {
          id: 2,
          amount: 200,
          type: TransactionType.TRANSFER_OUT,
          date: new Date('2023-02-01'),
        },
      };

      transferOutTransactionHandler.apply.mockResolvedValue(mockResponse);

      const result =
        await transactionController.createTransferOutTransaction(
          createTransactionDto,
        );

      expect(result).toEqual(mockResponse);
      expect(transferOutTransactionHandler.apply).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(transferOutTransactionHandler.apply).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the handler throws an exception', async () => {
      const createTransactionDto: CreateTransferTransactionDto = {
        amount: 200,
        accountType: 'Checking',
        accountNumber: '654321',
        name: 'Jane Doe',
        documentType: 'Passport',
        documentNumber: '987654321',
        bank: 'Bank B',
        description: 'Test transfer out',
      };
      const errorMessage = 'An error occurred';

      transferOutTransactionHandler.apply.mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(
        transactionController.createTransferOutTransaction(
          createTransactionDto,
        ),
      ).rejects.toThrowError(errorMessage);
      expect(transferOutTransactionHandler.apply).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(transferOutTransactionHandler.apply).toHaveBeenCalledTimes(1);
    });
  });

  describe('createWithdrawalTransaction', () => {
    it('should return a valid HTTPResponse when the handler succeeds', async () => {
      const createTransactionDto: WithdrawalAndDepositTransactionDto = {
        amount: 500,
        description: 'Test withdrawal',
      };
      const mockResponse: HTTPResponse = {
        code: HttpStatus.OK,
        message: 'Your withdrawal has been successfully processed',
        data: {
          id: 3,
          amount: 500,
          type: TransactionType.WITHDRAWAL,
          date: new Date('2023-03-01'),
        },
      };

      withdrawalTransactionHandler.apply.mockResolvedValue(mockResponse);

      const result =
        await transactionController.createWithdrawalTransaction(
          createTransactionDto,
        );

      expect(result).toEqual(mockResponse);
      expect(withdrawalTransactionHandler.apply).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(withdrawalTransactionHandler.apply).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the handler throws an exception', async () => {
      const createTransactionDto: WithdrawalAndDepositTransactionDto = {
        amount: 500,
        description: 'Test withdrawal',
      };
      const errorMessage = 'An error occurred';

      withdrawalTransactionHandler.apply.mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(
        transactionController.createWithdrawalTransaction(createTransactionDto),
      ).rejects.toThrowError(errorMessage);
      expect(withdrawalTransactionHandler.apply).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(withdrawalTransactionHandler.apply).toHaveBeenCalledTimes(1);
    });
  });

  describe('createDepositTransaction', () => {
    it('should return a valid HTTPResponse when the handler succeeds', async () => {
      const createTransactionDto: WithdrawalAndDepositTransactionDto = {
        amount: 1000,
        description: 'Test deposit',
      };
      const mockResponse: HTTPResponse = {
        code: HttpStatus.OK,
        message: 'Your deposit has been successfully processed',
        data: {
          id: 4,
          amount: 1000,
          type: TransactionType.DEPOSIT,
          date: new Date('2023-04-01'),
        },
      };

      depositTransactionHandler.apply.mockResolvedValue(mockResponse);

      const result =
        await transactionController.createDepositTransaction(
          createTransactionDto,
        );

      expect(result).toEqual(mockResponse);
      expect(depositTransactionHandler.apply).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(depositTransactionHandler.apply).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when the handler throws an exception', async () => {
      const createTransactionDto: WithdrawalAndDepositTransactionDto = {
        amount: 1000,
        description: 'Test deposit',
      };
      const errorMessage = 'An error occurred';

      depositTransactionHandler.apply.mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(
        transactionController.createDepositTransaction(createTransactionDto),
      ).rejects.toThrowError(errorMessage);
      expect(depositTransactionHandler.apply).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(depositTransactionHandler.apply).toHaveBeenCalledTimes(1);
    });
  });
});
