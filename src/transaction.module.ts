import { Module } from '@nestjs/common';
import { TransactionController } from './adapters/in/http/transaction.controller';
import { FindTransactionsByFiltersHandler } from './handlers/find-transactions-by-filters.handler';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseProperties } from './adapters/out/postgres/client.config';
import { TransactionRepository } from './adapters/out/postgres/transaction.repository';
import { ITransactionRepository } from 'domain/interfaces/transaction-repository.interface';
import { FindTransactionsByFiltersUseCase } from 'domain/usecases/find-transactions-by-filters.usecase';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(databaseProperties as TypeOrmModuleOptions),
    }),
  ],
  controllers: [TransactionController],
  providers: [
    FindTransactionsByFiltersHandler,
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
  ],
})
export class TransactionModule {}
