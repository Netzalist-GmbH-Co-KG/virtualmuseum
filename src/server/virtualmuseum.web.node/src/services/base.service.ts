import { ConfigService } from './config.service';

export abstract class BaseService {
    protected config: ConfigService;

    constructor() {
        this.config = ConfigService.getInstance();
    }

    protected getConfig(key: string): string {
        return this.config.get(key);
    }
}
