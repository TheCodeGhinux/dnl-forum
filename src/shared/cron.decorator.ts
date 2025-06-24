import { applyDecorators } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as dotenv from 'dotenv';

dotenv?.config?.();

export const DoxaCron = (
  cronTime: Parameters<typeof Cron>[0],
  options?: Parameters<typeof Cron>[1],
): MethodDecorator => {
  const enabled = process.env.CRON_ENABLED === 'true';

  return applyDecorators(
    enabled
      ? Cron(cronTime, options)
      : () => {
          /* Do nothing */
        },
  );
};
