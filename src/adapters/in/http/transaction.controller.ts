import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { FindTransactionsByFiltersHandler } from '../../../handlers/find-transactions-by-filters.handler';
import { FindTransactionsByFiltersDto } from '../../../models/dto/find-transactions-by-filters.dto';
import { PaginationQueryDto } from '../../../models/dto/pagination-query.dto';
import { HTTPResponse } from '../../../models/type/http-response';
import { TransferInTransactionHandler } from '../../../handlers/transfer-in-transaction.handler';
import { WithdrawalAndDepositTransactionDto } from '../../../models/dto/withdrawal-and-deposit-transaction.dto';
import { WithdrawalTransactionHandler } from '../../../handlers/withdrawal-transaction.handler';
import { DepositTransactionHandler } from '../../../handlers/deposit-transaction.handler';
import { TransferOutTransactionHandler } from '../../../handlers/transfer-out-transaction.handler';
import { CreateTransferTransactionDto } from '../../../models/dto/create-transfer-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly findTransactionsByFiltersHandler: FindTransactionsByFiltersHandler,
    private readonly transferInTransactionHandler: TransferInTransactionHandler,
    private readonly transferOutTransactionHandler: TransferOutTransactionHandler,
    private readonly withdrawalTransactionHandler: WithdrawalTransactionHandler,
    private readonly depositTransactionHandler: DepositTransactionHandler,
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

  @Post('/transfer-in')
  async createTransferInTransaction(
    @Body() createTransactionDto: CreateTransferTransactionDto,
  ): Promise<HTTPResponse> {
    return await this.transferInTransactionHandler.apply(createTransactionDto);
  }

  @Post('/withdrawal')
  async createWithdrawalTransaction(
    @Body() withdrawalTransactionDto: WithdrawalAndDepositTransactionDto,
  ): Promise<HTTPResponse> {
    return await this.withdrawalTransactionHandler.apply(
      withdrawalTransactionDto,
    );
  }

  @Post('/deposit')
  async createDepositTransaction(
    @Body() depositTransactionDto: WithdrawalAndDepositTransactionDto,
  ): Promise<HTTPResponse> {
    return await this.depositTransactionHandler.apply(depositTransactionDto);
  }

  @Post('/transfer-out')
  async createTransferOutTransaction(
    @Body() createTransactionDto: CreateTransferTransactionDto,
  ): Promise<HTTPResponse> {
    return await this.transferOutTransactionHandler.apply(createTransactionDto);
  }
}
