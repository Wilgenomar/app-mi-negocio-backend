import { Module } from '@nestjs/common';
import { TransactionController } from './adapters/in/http/transaction.controller';
import { FindTransactionsByFiltersHandler } from './handlers/find-transactions-by-filters.handler';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseProperties } from './adapters/out/postgres/client.config';
import { TransactionRepository } from './adapters/out/postgres/transaction.repository';
import { ITransactionRepository } from 'domain/interfaces/transaction-repository.interface';
import { FindTransactionsByFiltersUseCase } from 'domain/usecases/find-transactions-by-filters.usecase';
import { CreateTransactionUseCase } from 'domain/usecases/create-transaction.usecase';
import { TransferInTransactionHandler } from './handlers/transfer-in-transaction.handler';
import { BalanceModule } from './balance.module';
import { IBalanceRepository } from 'domain/interfaces/balance.repository.interface';
import { WithdrawalTransactionHandler } from './handlers/withdrawal-transaction.handler';
import { DepositTransactionHandler } from './handlers/deposit-transaction.handler';

@Module({
  imports: [
    BalanceModule,
    TypeOrmModule.forRoot({
      ...(databaseProperties as TypeOrmModuleOptions),
    }),
  ],
  controllers: [TransactionController],
  providers: [
    FindTransactionsByFiltersHandler,
    TransferInTransactionHandler,
    WithdrawalTransactionHandler,
    DepositTransactionHandler,
    {
      provide: 'TransactionRepository',
      useClass: TransactionRepository,
    },
    {
      provide: 'FindTransactionsByFiltersUseCase',
      useFactory: (transactionRepository: ITransactionRepository) => {
        return new FindTransactionsByFiltersUseCase(transactionRepository);
      },
      inject: ['TransactionRepository'],
    },
    {
      provide: 'CreateTransactionUseCase',
      useFactory: (
        transactionRepository: ITransactionRepository,
        balanceRepository: IBalanceRepository,
      ) => {
        return new CreateTransactionUseCase(
          transactionRepository,
          balanceRepository,
        );
      },
      inject: ['TransactionRepository', 'BalanceRepository'],
    },
  ],
})
export class TransactionModule {}
