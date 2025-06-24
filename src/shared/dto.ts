import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { RemittanceType } from './enums';

export class SalaryBreakdown {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(0)
  amount: number;
}

export class Remittance {
  @IsEnum(RemittanceType)
  @IsNotEmpty()
  type: RemittanceType;

  @IsBoolean()
  @IsNotEmpty()
  enabled: boolean;

  @IsBoolean()
  @IsNotEmpty()
  shouldRemit: boolean;

  @IsBoolean()
  @IsOptional()
  isWHT: boolean;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Max(100)
  whtRate: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Max(100)
  employeePercent: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Max(100)
  employerPercent: number;
}
