import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { FindTransactionsByFiltersDto } from '../dto/find-transactions-by-filters.dto';
import { FindTransactionsByFilterCommand } from 'domain/models/commands/find-transactions-by-filter.command';

export class TransactionMapper {
  public static toUseCaseCommand(
    filters: FindTransactionsByFiltersDto,
    pagination: PaginationQueryDto,
  ): FindTransactionsByFilterCommand {
    const { limit = 10, page = 1 } = pagination;

    const { fromDate, toDate, type } = filters;

    return {
      limit,
      page,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      type,
    };
  }
}
