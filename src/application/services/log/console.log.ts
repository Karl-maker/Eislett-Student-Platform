import Logger from './interface.log';

export default class ConsoleLogger implements Logger {
    private getFormattedDate(): string {
        const now = new Date();
        return now.toLocaleString();
    }

    info(message: string, optionalParams?: any): void {
        const logMessage = `[INFO] [${this.getFormattedDate()}] ${message}`;
        if (optionalParams) {
            console.info(logMessage, optionalParams);
        } else {
            console.info(logMessage);
        }
    }

    error(message: string, optionalParams?: any): void {
        const logMessage = `[ERROR] [${this.getFormattedDate()}] ${message}`;
        if (optionalParams) {
            console.error(logMessage, optionalParams);
        } else {
            console.error(logMessage);
        }
    }

    debug(message: string, optionalParams?: any): void {
        const logMessage = `[DEBUG] [${this.getFormattedDate()}] ${message}`;
        if (optionalParams) {
            console.debug(logMessage, optionalParams);
        } else {
            console.debug(logMessage);
        }
    }

    fatal(message: string, optionalParams?: any): void {
        const logMessage = `[FATAL] [${this.getFormattedDate()}] ${message}`;
        if (optionalParams) {
            console.error(logMessage, optionalParams);
        } else {
            console.error(logMessage);
        }
    }
}
