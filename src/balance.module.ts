import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseProperties } from './adapters/out/postgres/client.config';
import { GetBalanceUseCase } from 'domain/usecases/get-balance.usecase';
import { BalanceRepository } from './adapters/out/postgres/balance.repository';
import { IBalanceRepository } from 'domain/interfaces/balance.repository.interface';
import { BalanceController } from './adapters/in/http/balance.controller';
import { GetBalanceHandler } from './handlers/get-balance.handler';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(databaseProperties as TypeOrmModuleOptions),
    }),
  ],
  controllers: [BalanceController],
  providers: [
    GetBalanceHandler,
    {
      provide: 'BalanceRepository',
      useClass: BalanceRepository,
    },
    {
      provide: 'GetBalanceUseCase',
      useFactory: (balanceRepository: IBalanceRepository) => {
        return new GetBalanceUseCase(balanceRepository);
      },
      inject: ['BalanceRepository'],
    },
  ],
  exports: ['BalanceRepository'],
})
export class BalanceModule {}
