import { EntitySchema } from 'typeorm';
import { Transaction } from '../../../../../domain/models/entities/transaction.entity';

export const TransactionSchema = new EntitySchema<Transaction>({
  name: 'Transaction',
  tableName: 'transactions',
  target: Transaction,
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
    accountType: {
      type: String,
      name: 'account_type',
    },
    accountNumber: {
      type: String,
      name: 'account_number',
    },
    name: {
      type: String,
      name: 'name',
    },
    documentType: {
      type: String,
      name: 'document_type',
    },
    documentNumber: {
      type: String,
      name: 'document_number',
    },
    type: {
      type: String,
      name: 'type',
    },
    bank: {
      type: String,
      name: 'bank',
    },
    description: {
      type: String,
      name: 'description',
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
