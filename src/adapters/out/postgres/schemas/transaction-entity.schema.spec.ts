import { EntitySchemaColumnOptions } from 'typeorm';
import { TransactionSchema } from './transaction-entity.schema';
import { Transaction } from '../../../../../domain/models/entities/transaction.entity';

describe('TransactionSchema', () => {
  test('should have the correct configuration', () => {
    const transactionSchema = TransactionSchema;

    expect(transactionSchema.options.name).toEqual('Transaction');
    expect(transactionSchema.options.tableName).toEqual('transactions');
    expect(transactionSchema.options.target).toEqual(Transaction);
  });

  describe('columns', () => {
    const columns = TransactionSchema.options.columns as Record<
      string,
      EntitySchemaColumnOptions
    >;

    test('should have the correct columns', () => {
      expect(columns).toHaveProperty('id');
      expect(columns).toHaveProperty('amount');
      expect(columns).toHaveProperty('accountType');
      expect(columns).toHaveProperty('accountNumber');
      expect(columns).toHaveProperty('name');
      expect(columns).toHaveProperty('documentType');
      expect(columns).toHaveProperty('documentNumber');
      expect(columns).toHaveProperty('type');
      expect(columns).toHaveProperty('bank');
      expect(columns).toHaveProperty('description');
      expect(columns).toHaveProperty('createdAt');
      expect(columns).toHaveProperty('updatedAt');
    });

    test('should have the correct types for columns', () => {
      expect(columns.id.type).toEqual(Number);
      expect(columns.amount.type).toEqual(Number);
      expect(columns.accountType.type).toEqual(String);
      expect(columns.accountNumber.type).toEqual(String);
      expect(columns.name.type).toEqual(String);
      expect(columns.documentType.type).toEqual(String);
      expect(columns.documentNumber.type).toEqual(String);
      expect(columns.type.type).toEqual(String);
      expect(columns.bank.type).toEqual(String);
      expect(columns.description.type).toEqual(String);
      expect(columns.createdAt.type).toEqual(Date);
      expect(columns.updatedAt.type).toEqual(Date);
    });
  });
});
