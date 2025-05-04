import { EntitySchemaColumnOptions } from 'typeorm';
import { BalanceSchema } from './balance-entity.schema';
import { Balance } from '../../../../../domain/models/entities/balance.entity';

describe('BalanceSchema', () => {
  test('should have the correct configuration', () => {
    const balanceSchema = BalanceSchema;

    expect(balanceSchema.options.name).toEqual('Balance');
    expect(balanceSchema.options.tableName).toEqual('balances');
    expect(balanceSchema.options.target).toEqual(Balance);
  });

  describe('columns', () => {
    const columns = BalanceSchema.options.columns as Record<
      string,
      EntitySchemaColumnOptions
    >;

    test('should have the correct columns', () => {
      expect(columns).toHaveProperty('id');
      expect(columns).toHaveProperty('amount');
      expect(columns).toHaveProperty('createdAt');
      expect(columns).toHaveProperty('updatedAt');
    });

    test('should have the correct types for columns', () => {
      expect(columns.id.type).toEqual(Number);
      expect(columns.amount.type).toEqual(Number);
      expect(columns.createdAt.type).toEqual(Date);
      expect(columns.updatedAt.type).toEqual(Date);
    });
  });
});
