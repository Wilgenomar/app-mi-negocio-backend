import { Balance } from 'domain/models/entities/balance.entity';
import { GetBalanceResponse } from 'domain/models/types/get-balance-response.type';

export class BalanceMapper {
  public static toGetBalanceResponseData(balance: Balance): GetBalanceResponse {
    return {
      balance: balance.amount,
      updatedAt: balance.updatedAt,
    };
  }
}
