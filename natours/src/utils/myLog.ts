export function consoleLog(msg?: any, ...optionalParams: any[]) {
  if (process.env.NODE_ENV === 'development'){
    console.log(msg, optionalParams);
  }
}
