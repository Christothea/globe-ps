import { Account } from './models/account.model';
import { Repositories } from './repositories.enum';

export const accountsProviders = [
  {
    provide: Repositories.ACCOUNTS_REPOSITORY,
    useValue: Account,
  },
];
