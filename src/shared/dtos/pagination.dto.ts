import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { SortOrder } from "../enums/sort-order.enum";

/**
 * Pagination input
 * @class PaginationDto
 * @description Pagination input for pagination.
 * @example
 * ```typescript
 * const pagination: PaginationDto = {
 *  offset: 0,
 *  limit: 10,
 *  orderDirection: SortOrder.ASC,
 * }
 * ```
 */
export class PaginationDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsEnum(SortOrder)
  orderDirection?: SortOrder;
}
