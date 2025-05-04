import { Controller, Get } from '@nestjs/common';
import { GetBalanceHandler } from '../../../handlers/get-balance.handler';
import { HTTPResponse } from 'src/models/type/http-response';

@Controller('balances')
export class BalanceController {
  constructor(private readonly getBalanceHandler: GetBalanceHandler) {}

  @Get()
  async getBalance(): Promise<HTTPResponse> {
    return await this.getBalanceHandler.apply();
  }
}
