import { EntitySchema } from 'typeorm';
import { Balance } from '../../../../../domain/models/entities/balance.entity';

export const BalanceSchema = new EntitySchema<Balance>({
  name: 'Balance',
  tableName: 'balances',
  target: Balance,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    amount: {
      type: Number,
      name: 'amount',
    },
    createdAt: {
      type: Date,
      name: 'created_at',
    },
    updatedAt: {
      type: Date,
      name: 'updated_at',
    },
  },
});
