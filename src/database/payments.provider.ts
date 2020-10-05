import { Payment } from './models/payment.model';
import { Repositories } from './repositories.enum';

export const paymentsProviders = [
  {
    provide: Repositories.PAYMENTS_REPOSITORY,
    useValue: Payment,
  },
];
