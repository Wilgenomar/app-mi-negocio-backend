/* eslint-disable @typescript-eslint/unbound-method */
import { GetBalanceUseCase } from '../../domain/usecases/get-balance.usecase';
import { GetBalanceHandler } from './get-balance.handler';
import { HTTPResponse } from '../models/type/http-response';
import { BalanceMapper } from '../models/mappers/balance.mapper';
import { mock, MockProxy } from 'jest-mock-extended';
import { HttpStatus } from '@nestjs/common';
import { Balance } from '../../domain/models/entities/balance.entity';

describe('GetBalanceHandler', () => {
  let getBalanceHandler: GetBalanceHandler;
  let getBalanceUseCase: MockProxy<GetBalanceUseCase>;

  beforeEach(() => {
    getBalanceUseCase = mock<GetBalanceUseCase>();
    getBalanceHandler = new GetBalanceHandler(getBalanceUseCase);
  });

  it('should return a valid HTTPResponse when the use case succeeds', async () => {
    const mockBalance = new Balance(
      1000,
      new Date('2023-01-01'),
      new Date('2023-01-02'),
    );
    const mockResponseData = {
      balance: 1000,
      updatedAt: new Date('2023-01-02'),
    };
    const expectedResponse: HTTPResponse = {
      code: HttpStatus.OK,
      message: 'Transactions retrieved successfully',
      data: mockResponseData,
    };

    getBalanceUseCase.execute.mockResolvedValue(mockBalance);
    jest
      .spyOn(BalanceMapper, 'toGetBalanceResponseData')
      .mockReturnValue(mockResponseData);

    const result = await getBalanceHandler.apply();

    expect(result).toEqual(expectedResponse);
    expect(getBalanceUseCase.execute).toHaveBeenCalledTimes(1);
    expect(BalanceMapper.toGetBalanceResponseData).toHaveBeenCalledWith(
      mockBalance,
    );
  });

  it('should throw an error when the use case throws an exception', async () => {
    const errorMessage = 'An error occurred';
    getBalanceUseCase.execute.mockRejectedValue(new Error(errorMessage));

    await expect(getBalanceHandler.apply()).rejects.toThrowError(errorMessage);
    expect(getBalanceUseCase.execute).toHaveBeenCalledTimes(1);
  });
});
