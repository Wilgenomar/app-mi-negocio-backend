import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TransactionMapper } from '../models/mappers/transaction.mapper';
import { HTTPResponse } from '../models/type/http-response';
import { CreateTransactionUseCase } from '../../domain/usecases/create-transaction.usecase';
import { CreateTransferTransactionDto } from 'src/models/dto/create-transfer-transaction.dto';

@Injectable()
class TransferOutTransactionHandler {
  constructor(
    @Inject('CreateTransactionUseCase')
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  async apply(
    createTranferOutTransactionDto: CreateTransferTransactionDto,
  ): Promise<HTTPResponse> {
    const transaction = TransactionMapper.toTransferOutTransaction(
      createTranferOutTransactionDto,
    );

    const result = await this.createTransactionUseCase.execute(transaction);

    return {
      code: HttpStatus.OK,
      message: 'The outbound transfer has been successfully processed.',
      data: result,
    };
  }
}

export { TransferOutTransactionHandler };
