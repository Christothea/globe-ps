export class AuthConfig {
    public tokenSecretKey: string;
    public tokenExpiryTimeInHours: number;

    constructor(partial: Partial<AuthConfig> = {}) {
        Object.assign(this, partial);
    }

}
