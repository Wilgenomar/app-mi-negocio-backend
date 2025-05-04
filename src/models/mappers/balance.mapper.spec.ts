import { BalanceMapper } from './balance.mapper';
import { Balance } from '../../../domain/models/entities/balance.entity';
import { GetBalanceResponse } from '../../../domain/models/types/get-balance-response.type';

describe('BalanceMapper', () => {
  it('should map a Balance entity to a GetBalanceResponse', () => {
    const balance = new Balance(
      1000,
      new Date('2023-01-01'),
      new Date('2023-01-02'),
    );
    const expectedResponse: GetBalanceResponse = {
      balance: 1000,
      updatedAt: new Date('2023-01-02'),
    };

    const result = BalanceMapper.toGetBalanceResponseData(balance);

    expect(result).toEqual(expectedResponse);
  });
});
