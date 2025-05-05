import { InjectEntityManager } from '@nestjs/typeorm';
import { PostgresDataSource } from './client.config';
import { EntityManager, Between, FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from '../../../../domain/interfaces/transaction-repository.interface';
import { FindTransactionsByFilterCommand } from '../../../../domain/models/commands/find-transactions-by-filter.command';
import { Transaction } from '../../../../domain/models/entities/transaction.entity';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectEntityManager(PostgresDataSource)
    private readonly entityManager: EntityManager,
  ) {}

  async find(filters: FindTransactionsByFilterCommand): Promise<Transaction[]> {
    const where: FindOptionsWhere<Transaction> = {};
    if (filters.fromDate && filters.toDate) {
      where.createdAt = Between(
        new Date(filters.fromDate),
        new Date(filters.toDate),
      );
    }

    if (filters.type) {
      where.type = filters.type;
    }

    const result = await this.entityManager.find(Transaction, {
      where,
      order: { createdAt: 'DESC' },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    });
    return result;
  }

  async saveAndUpdateBalance(
    transaction: Transaction,
    amountChange: number,
  ): Promise<Transaction> {
    return await this.entityManager.transaction(async (manager) => {
      const savedTransaction = await manager.save(Transaction, transaction);

      await manager.query(`UPDATE balances SET amount = amount + $1 `, [
        amountChange,
      ]);

      return savedTransaction;
    });
  }
}
