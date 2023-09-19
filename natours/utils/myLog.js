"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleLog = void 0;
function consoleLog(msg, ...optionalParams) {
    if (process.env.NODE_ENV === 'development') {
        console.log(msg, optionalParams);
    }
}
exports.consoleLog = consoleLog;
