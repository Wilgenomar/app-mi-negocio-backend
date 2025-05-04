/* eslint-disable @typescript-eslint/unbound-method */
import { BalanceController } from './balance.controller';
import { GetBalanceHandler } from '../../../handlers/get-balance.handler';
import { HTTPResponse } from '../../../models/type/http-response';
import { mock, MockProxy } from 'jest-mock-extended';

describe('BalanceController', () => {
  let balanceController: BalanceController;
  let getBalanceHandler: MockProxy<GetBalanceHandler>;

  beforeEach(() => {
    getBalanceHandler = mock<GetBalanceHandler>();
    balanceController = new BalanceController(getBalanceHandler);
  });

  it('should return a valid HTTPResponse when the handler succeeds', async () => {
    const mockResponse: HTTPResponse = {
      code: 200,
      message: 'Balance retrieved successfully',
      data: { balance: 1000 },
    };
    getBalanceHandler.apply.mockResolvedValue(mockResponse);

    const result = await balanceController.getBalance();

    expect(result).toEqual(mockResponse);
    expect(getBalanceHandler.apply).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the handler throws an exception', async () => {
    const errorMessage = 'An error occurred while retrieving the balance';
    getBalanceHandler.apply.mockRejectedValue(new Error(errorMessage));

    await expect(balanceController.getBalance()).rejects.toThrowError(
      errorMessage,
    );
    expect(getBalanceHandler.apply).toHaveBeenCalledTimes(1);
  });
});
