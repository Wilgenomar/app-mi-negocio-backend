import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationQueryDto {
  @Transform((obj) => {
    return Number(obj.value);
  })
  @IsNumber()
  @IsOptional()
  @Max(20)
  @Min(1)
  limit?: number;

  @Transform((obj) => {
    return Number(obj.value);
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;
}
