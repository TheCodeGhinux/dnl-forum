import { IsNumber, IsOptional, IsString, IsPositive } from 'class-validator';

export class PaginationRequestDTO {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  all?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sort?: string;
}
