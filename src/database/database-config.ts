export class DatabaseConfig {
    constructor(partial: Partial<DatabaseConfig> = {}) {
        Object.assign(this, partial);
    }

    public host: string;
    public port: number;
    public username: string;
    public password: string;
    public database: string;
}