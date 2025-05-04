import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { GetBalanceUseCase } from '../../domain/usecases/get-balance.usecase';
import { HTTPResponse } from '../models/type/http-response';
import { BalanceMapper } from '../models/mappers/balance.mapper';

@Injectable()
class GetBalanceHandler {
  constructor(
    @Inject('GetBalanceUseCase')
    private readonly getBalanceUseCase: GetBalanceUseCase,
  ) {}

  async apply(): Promise<HTTPResponse> {
    const balance = await this.getBalanceUseCase.execute();

    const responseData = BalanceMapper.toGetBalanceResponseData(balance);

    return {
      code: HttpStatus.OK,
      message: 'Transactions retrieved successfully',
      data: responseData,
    };
  }
}

export { GetBalanceHandler };
