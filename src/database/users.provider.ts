import { User } from './models/user.model';
import { Repositories } from './repositories.enum';

export const usersProviders = [
    {
        provide: Repositories.USERS_REPOSITORY,
        useValue: User,
    },
];
