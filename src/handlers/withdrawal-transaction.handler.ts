import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TransactionMapper } from '../models/mappers/transaction.mapper';
import { HTTPResponse } from '../models/type/http-response';
import { CreateTransactionUseCase } from '../../domain/usecases/create-transaction.usecase';
import { WithdrawalAndDepositTransactionDto } from '../models/dto/withdrawal-and-deposit-transaction.dto';

@Injectable()
class WithdrawalTransactionHandler {
  constructor(
    @Inject('CreateTransactionUseCase')
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  async apply(
    createTransactionDto: WithdrawalAndDepositTransactionDto,
  ): Promise<HTTPResponse> {
    const transaction =
      TransactionMapper.toWithdrawalTransaction(createTransactionDto);

    const result = await this.createTransactionUseCase.execute(transaction);

    return {
      code: HttpStatus.OK,
      message: 'Your withdrawal has been successfully processed',
      data: result,
    };
  }
}

export { WithdrawalTransactionHandler };
