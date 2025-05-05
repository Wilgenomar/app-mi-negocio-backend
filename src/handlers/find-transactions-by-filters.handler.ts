import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FindTransactionsByFiltersUseCase } from '../../domain/usecases/find-transactions-by-filters.usecase';
import { FindTransactionsByFiltersDto } from '../models/dto/find-transactions-by-filters.dto';
import { PaginationQueryDto } from '../models/dto/pagination-query.dto';
import { TransactionMapper } from '../models/mappers/transaction.mapper';
import { HTTPResponse } from '../models/type/http-response';

@Injectable()
class FindTransactionsByFiltersHandler {
  constructor(
    @Inject('FindTransactionsByFiltersUseCase')
    private readonly findTransactionsByFiltersUseCase: FindTransactionsByFiltersUseCase,
  ) {}

  async apply(
    filters: FindTransactionsByFiltersDto,
    pagination: PaginationQueryDto,
  ): Promise<HTTPResponse> {
    const command = TransactionMapper.toUseCaseCommand(filters, pagination);

    const result = await this.findTransactionsByFiltersUseCase.execute(command);
    return {
      code: HttpStatus.OK,
      message: 'Transactions retrieved successfully',
      data: result,
    };
  }
}

export { FindTransactionsByFiltersHandler };
