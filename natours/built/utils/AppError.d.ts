export default class AppError extends Error {
    statusCode: number;
    message: string;
    msg2: string;
    status: string;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
