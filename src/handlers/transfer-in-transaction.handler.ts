import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TransactionMapper } from '../models/mappers/transaction.mapper';
import { HTTPResponse } from '../models/type/http-response';
import { CreateTransactionUseCase } from '../../domain/usecases/create-transaction.usecase';
import { CreateTransferTransactionDto } from 'src/models/dto/create-transfer-transaction.dto';

@Injectable()
class TransferInTransactionHandler {
  constructor(
    @Inject('CreateTransactionUseCase')
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  async apply(
    creatTransferInTransactionDto: CreateTransferTransactionDto,
  ): Promise<HTTPResponse> {
    const transaction = TransactionMapper.toTransferInTransaction(
      creatTransferInTransactionDto,
    );

    const result = await this.createTransactionUseCase.execute(transaction);

    return {
      code: HttpStatus.OK,
      message: 'The inbound transfer has been successfully processed.',
      data: result,
    };
  }
}

export { TransferInTransactionHandler };
