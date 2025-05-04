import { InjectEntityManager } from '@nestjs/typeorm';
import { PostgresDataSource } from './client.config';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IBalanceRepository } from 'domain/interfaces/balance.repository.interface';
import { Balance } from 'domain/models/entities/balance.entity';

@Injectable()
export class BalanceRepository implements IBalanceRepository {
  constructor(
    @InjectEntityManager(PostgresDataSource)
    private readonly entityManager: EntityManager,
  ) {}

  async find(): Promise<Balance | null> {
    const result = await this.entityManager.findOne(Balance, {
      where: {},
    });
    return result;
  }
}
