export default interface Logger {
    info: (message: string, optionalParams?: any) => void;
    error: (message: string, optionalParams?: any) => void;
    debug: (message: string, optionalParams?: any) => void;
    fatal: (message: string, optionalParams?: any) => void;
}
