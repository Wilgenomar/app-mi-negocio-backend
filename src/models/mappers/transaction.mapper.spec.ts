import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { FindTransactionsByFiltersDto } from '../dto/find-transactions-by-filters.dto';
import { TransactionType } from '../../../domain/models/enums/transaction-type.enum';
import { TransactionMapper } from './transaction.mapper';
import { Transaction } from '../../../domain/models/entities/transaction.entity';
import { CreateTransferTransactionDto } from '../dto/create-transfer-transaction.dto';
import { WithdrawalAndDepositTransactionDto } from '../dto/withdrawal-and-deposit-transaction.dto';

describe('TransactionMapper', () => {
  describe('toUseCaseCommand', () => {
    it('should map filters and pagination to a use case command with all fields', () => {
      const filters: FindTransactionsByFiltersDto = {
        fromDate: '2023-01-01',
        toDate: '2023-01-31',
        type: TransactionType.TRANSFER_IN,
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
        type: TransactionType.TRANSFER_IN,
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
        type: TransactionType.TRANSFER_OUT,
      };
      const pagination: PaginationQueryDto = {};

      const result = TransactionMapper.toUseCaseCommand(filters, pagination);

      expect(result).toEqual({
        limit: 10,
        page: 1,
        fromDate: new Date('2023-01-01'),
        toDate: new Date('2023-01-31'),
        type: TransactionType.TRANSFER_OUT,
      });
    });
  });

  describe('Transfer Transaction', () => {
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

    describe('toTransferInTransaction', () => {
      it('should map CreateTransferTransactionDto to a Transaction entity with type TRANSFER_IN', () => {
        const result =
          TransactionMapper.toTransferInTransaction(createTransactionDto);

        expect(result).toBeInstanceOf(Transaction);
        expect(result.amount).toEqual(createTransactionDto.amount);
        expect(result.accountType).toEqual(createTransactionDto.accountType);
        expect(result.accountNumber).toEqual(
          createTransactionDto.accountNumber,
        );
        expect(result.name).toEqual(createTransactionDto.name);
        expect(result.documentType).toEqual(createTransactionDto.documentType);
        expect(result.documentNumber).toEqual(
          createTransactionDto.documentNumber,
        );
        expect(result.bank).toEqual(createTransactionDto.bank);
        expect(result.description).toEqual(createTransactionDto.description);
        expect(result.type).toEqual(TransactionType.TRANSFER_IN);
        expect(result.createdAt).toBeInstanceOf(Date);
        expect(result.updatedAt).toBeInstanceOf(Date);
      });

      it('should map CreateTransactionDto to a Transaction entity with type TRANSFER_IN and optional description undefined', () => {
        const createTransactionDto: CreateTransferTransactionDto = {
          amount: 1500,
          accountType: 'Checking',
          accountNumber: '654321',
          name: 'Jane Doe',
          documentType: 'Passport',
          documentNumber: '987654321',
          bank: 'Bank B',
        };

        const result =
          TransactionMapper.toTransferInTransaction(createTransactionDto);

        expect(result).toBeInstanceOf(Transaction);
        expect(result.amount).toEqual(createTransactionDto.amount);
        expect(result.accountType).toEqual(createTransactionDto.accountType);
        expect(result.accountNumber).toEqual(
          createTransactionDto.accountNumber,
        );
        expect(result.name).toEqual(createTransactionDto.name);
        expect(result.documentType).toEqual(createTransactionDto.documentType);
        expect(result.documentNumber).toEqual(
          createTransactionDto.documentNumber,
        );
        expect(result.bank).toEqual(createTransactionDto.bank);
        expect(result.description).toEqual(createTransactionDto.description);
        expect(result.type).toEqual(TransactionType.TRANSFER_IN);
        expect(result.createdAt).toBeInstanceOf(Date);
        expect(result.updatedAt).toBeInstanceOf(Date);
        expect(result.description).toBeUndefined();
      });
    });

    describe('toTransferOutTransaction', () => {
      it('should map CreateTransferTransactionDto to a Transaction entity with type TRANSFER_IN', () => {
        const result =
          TransactionMapper.toTransferOutTransaction(createTransactionDto);

        expect(result).toBeInstanceOf(Transaction);
        expect(result.amount).toEqual(createTransactionDto.amount);
        expect(result.accountType).toEqual(createTransactionDto.accountType);
        expect(result.accountNumber).toEqual(
          createTransactionDto.accountNumber,
        );
        expect(result.name).toEqual(createTransactionDto.name);
        expect(result.documentType).toEqual(createTransactionDto.documentType);
        expect(result.documentNumber).toEqual(
          createTransactionDto.documentNumber,
        );
        expect(result.bank).toEqual(createTransactionDto.bank);
        expect(result.description).toEqual(createTransactionDto.description);
        expect(result.type).toEqual(TransactionType.TRANSFER_OUT);
        expect(result.createdAt).toBeInstanceOf(Date);
        expect(result.updatedAt).toBeInstanceOf(Date);
      });

      it('should map CreateTransactionDto to a Transaction entity with type TRANSFER_IN and optional description undefined', () => {
        const createTransactionDto: CreateTransferTransactionDto = {
          amount: 1500,
          accountType: 'Checking',
          accountNumber: '654321',
          name: 'Jane Doe',
          documentType: 'Passport',
          documentNumber: '987654321',
          bank: 'Bank B',
        };

        const result =
          TransactionMapper.toTransferOutTransaction(createTransactionDto);

        expect(result).toBeInstanceOf(Transaction);
        expect(result.amount).toEqual(createTransactionDto.amount);
        expect(result.accountType).toEqual(createTransactionDto.accountType);
        expect(result.accountNumber).toEqual(
          createTransactionDto.accountNumber,
        );
        expect(result.name).toEqual(createTransactionDto.name);
        expect(result.documentType).toEqual(createTransactionDto.documentType);
        expect(result.documentNumber).toEqual(
          createTransactionDto.documentNumber,
        );
        expect(result.bank).toEqual(createTransactionDto.bank);
        expect(result.description).toEqual(createTransactionDto.description);
        expect(result.type).toEqual(TransactionType.TRANSFER_OUT);
        expect(result.createdAt).toBeInstanceOf(Date);
        expect(result.updatedAt).toBeInstanceOf(Date);
        expect(result.description).toBeUndefined();
      });
    });
  });

  describe('toWithdrawalTransaction', () => {
    const createTransactionDto: WithdrawalAndDepositTransactionDto = {
      amount: 1000,
      description: 'Test transaction',
    };

    it('should map CreateTransferTransactionDto to a Transaction entity with type WITHDRAWAL', () => {
      const result =
        TransactionMapper.toWithdrawalTransaction(createTransactionDto);

      expect(result).toBeInstanceOf(Transaction);
      expect(result.amount).toEqual(createTransactionDto.amount);
      expect(result.accountType).toBeUndefined();
      expect(result.accountNumber).toBeUndefined();
      expect(result.name).toBeUndefined();
      expect(result.documentType).toBeUndefined();
      expect(result.documentNumber).toBeUndefined();
      expect(result.bank).toBeUndefined();
      expect(result.description).toEqual(createTransactionDto.description);
      expect(result.type).toEqual(TransactionType.WITHDRAWAL);
      expect(result.createdAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
    });

    it('should map CreateTransactionDto to a Transaction entity with type WITHDRAWAL and optional description undefined', () => {
      const createTransactionDto: WithdrawalAndDepositTransactionDto = {
        amount: 1000,
      };

      const result =
        TransactionMapper.toWithdrawalTransaction(createTransactionDto);

      expect(result).toBeInstanceOf(Transaction);
      expect(result.amount).toEqual(createTransactionDto.amount);
      expect(result.accountType).toBeUndefined();
      expect(result.accountNumber).toBeUndefined();
      expect(result.name).toBeUndefined();
      expect(result.documentType).toBeUndefined();
      expect(result.documentNumber).toBeUndefined();
      expect(result.bank).toBeUndefined();
      expect(result.description).toBeUndefined();
      expect(result.type).toEqual(TransactionType.WITHDRAWAL);
      expect(result.createdAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
    });

    // public static (
    //   withdrawalTransaction: WithdrawalAndDepositTransactionDto,
    // ): Transaction {
    //   return new Transaction(
    //     TransactionType.WITHDRAWAL,
    //     withdrawalTransaction.amount,
    //     withdrawalTransaction.description,
    //   );
    // }

    // public static toDepositTransaction(
    //   withdrawalTransaction: ,
    // ): Transaction {
    //   return new Transaction(
    //     TransactionType.DEPOSIT,
    //     withdrawalTransaction.amount,
    //     withdrawalTransaction.description,
    //   );
    // }
  });

  describe('toDepositTransaction', () => {
    const createTransactionDto: WithdrawalAndDepositTransactionDto = {
      amount: 1000,
      description: 'Test transaction',
    };

    it('should map CreateTransferTransactionDto to a Transaction entity with type WITHDRAWAL', () => {
      const result =
        TransactionMapper.toDepositTransaction(createTransactionDto);

      expect(result).toBeInstanceOf(Transaction);
      expect(result.amount).toEqual(createTransactionDto.amount);
      expect(result.accountType).toBeUndefined();
      expect(result.accountNumber).toBeUndefined();
      expect(result.name).toBeUndefined();
      expect(result.documentType).toBeUndefined();
      expect(result.documentNumber).toBeUndefined();
      expect(result.bank).toBeUndefined();
      expect(result.description).toEqual(createTransactionDto.description);
      expect(result.type).toEqual(TransactionType.DEPOSIT);
      expect(result.createdAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
    });

    it('should map CreateTransactionDto to a Transaction entity with type WITHDRAWAL and optional description undefined', () => {
      const createTransactionDto: WithdrawalAndDepositTransactionDto = {
        amount: 1000,
      };

      const result =
        TransactionMapper.toDepositTransaction(createTransactionDto);

      expect(result).toBeInstanceOf(Transaction);
      expect(result.amount).toEqual(createTransactionDto.amount);
      expect(result.accountType).toBeUndefined();
      expect(result.accountNumber).toBeUndefined();
      expect(result.name).toBeUndefined();
      expect(result.documentType).toBeUndefined();
      expect(result.documentNumber).toBeUndefined();
      expect(result.bank).toBeUndefined();
      expect(result.description).toBeUndefined();
      expect(result.type).toEqual(TransactionType.DEPOSIT);
      expect(result.createdAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
    });
  });
});
