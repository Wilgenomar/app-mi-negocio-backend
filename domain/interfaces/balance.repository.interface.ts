import { Balance } from 'domain/models/entities/balance.entity';

export interface IBalanceRepository {
  find(this: void): Promise<Balance | null>;
}
