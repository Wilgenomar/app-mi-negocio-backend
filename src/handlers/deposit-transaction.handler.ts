import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TransactionMapper } from '../models/mappers/transaction.mapper';
import { HTTPResponse } from '../models/type/http-response';
import { CreateTransactionUseCase } from '../../domain/usecases/create-transaction.usecase';
import { WithdrawalAndDepositTransactionDto } from '../models/dto/withdrawal-and-deposit-transaction.dto';

@Injectable()
class DepositTransactionHandler {
  constructor(
    @Inject('CreateTransactionUseCase')
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  async apply(
    createTransactionDto: WithdrawalAndDepositTransactionDto,
  ): Promise<HTTPResponse> {
    const transaction =
      TransactionMapper.toDepositTransaction(createTransactionDto);

    const result = await this.createTransactionUseCase.execute(transaction);

    return {
      code: HttpStatus.OK,
      message: 'Your deposit has been successfully processed',
      data: result,
    };
  }
}

export { DepositTransactionHandler };
