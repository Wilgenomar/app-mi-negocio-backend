import { Controller, Get, Query } from '@nestjs/common';
import { FindTransactionsByFiltersHandler } from '../../../handlers/find-transactions-by-filters.handler';
import { FindTransactionsByFiltersDto } from '../../../models/dto/find-transactions-by-filters.dto';
import { PaginationQueryDto } from '../../../models/dto/pagination-query.dto';
import { HTTPResponse } from '../../../models/type/http-response';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly findTransactionsByFiltersHandler: FindTransactionsByFiltersHandler,
  ) {}

  @Get()
  async list(
    @Query() filters: FindTransactionsByFiltersDto,
    @Query() pagination: PaginationQueryDto,
  ): Promise<HTTPResponse> {
    return await this.findTransactionsByFiltersHandler.apply(
      filters,
      pagination,
    );
  }
}
