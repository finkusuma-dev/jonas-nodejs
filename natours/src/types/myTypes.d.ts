export type TMyController = (
  req?: E.Request,
  res?: E.Response,
  next?: E.NextFunction,
) => Promise<void>;
