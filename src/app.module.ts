import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BalanceModule } from './balance.module';
import { TransactionModule } from './transaction.module';

@Module({
  imports: [BalanceModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
