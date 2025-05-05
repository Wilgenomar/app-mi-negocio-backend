import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TransactionMapper } from '../models/mappers/transaction.mapper';
import { HTTPResponse } from '../models/type/http-response';
import { CreateTransactionDto } from 'src/models/dto/create-transaction.dto';
import { CreateTransactionUseCase } from '../../domain/usecases/create-transaction.usecase';

@Injectable()
class ReceiveTransactionHandler {
  constructor(
    @Inject('CreateTransactionUseCase')
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  async apply(
    createTransactionDto: CreateTransactionDto,
  ): Promise<HTTPResponse> {
    const transaction =
      TransactionMapper.toReceiveTransaction(createTransactionDto);

    const result = await this.createTransactionUseCase.execute(transaction);

    return {
      code: HttpStatus.OK,
      message: 'Transactions retrieved successfully',
      data: result,
    };
  }
}

export { ReceiveTransactionHandler };
