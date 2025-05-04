import { GetBalanceUseCase } from './get-balance.usecase';
import { IBalanceRepository } from 'domain/interfaces/balance.repository.interface';
import { Balance } from 'domain/models/entities/balance.entity';
import { mock, MockProxy } from 'jest-mock-extended';

describe('GetBalanceUseCase', () => {
  let getBalanceUseCase: GetBalanceUseCase;
  let balanceRepository: MockProxy<IBalanceRepository>;

  beforeEach(() => {
    balanceRepository = mock<IBalanceRepository>();
    getBalanceUseCase = new GetBalanceUseCase(balanceRepository);
  });

  it('should return the balance when it exists', async () => {
    const mockBalance: Balance = {
      id: 1,
      amount: 1000,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    balanceRepository.find.mockResolvedValue(mockBalance);

    const result = await getBalanceUseCase.execute();

    expect(result).toEqual(mockBalance);
    expect(balanceRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the balance does not exist', async () => {
    balanceRepository.find.mockResolvedValue(null);

    await expect(getBalanceUseCase.execute()).rejects.toThrowError(
      'The record for the entity Balance does not exist.',
    );
    expect(balanceRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when an unexpected error occurs', async () => {
    balanceRepository.find.mockRejectedValue(new Error('Database error'));

    await expect(getBalanceUseCase.execute()).rejects.toThrowError(
      'An error occurred while fetching the balance. Error: Database error',
    );
    expect(balanceRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should throw an error with a generic message when an unknown error occurs', async () => {
    balanceRepository.find.mockRejectedValue('Unknown error');

    await expect(getBalanceUseCase.execute()).rejects.toThrowError(
      'An error occurred while fetching the balance. Error: Unknown error',
    );
    expect(balanceRepository.find).toHaveBeenCalledTimes(1);
  });
});
