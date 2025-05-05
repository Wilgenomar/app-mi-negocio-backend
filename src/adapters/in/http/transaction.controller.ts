import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { FindTransactionsByFiltersHandler } from '../../../handlers/find-transactions-by-filters.handler';
import { FindTransactionsByFiltersDto } from '../../../models/dto/find-transactions-by-filters.dto';
import { PaginationQueryDto } from '../../../models/dto/pagination-query.dto';
import { HTTPResponse } from '../../../models/type/http-response';
import { CreateTransactionDto } from '../../../models/dto/create-transaction.dto';
import { ReceiveTransactionHandler } from '../../../handlers/receive-transaction.handler';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly findTransactionsByFiltersHandler: FindTransactionsByFiltersHandler,
    private readonly receiveTransactionHandler: ReceiveTransactionHandler,
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

  @Post('/receive')
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<HTTPResponse> {
    return await this.receiveTransactionHandler.apply(createTransactionDto);
  }
}
