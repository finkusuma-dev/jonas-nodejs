import { IUser } from "../models/userModel";

export type TMyController = (
  req?: E.Request,
  res?: E.Response,
  next?: E.NextFunction,
) => Promise<void>;


declare global {
  namespace Express {
    interface Request {
      user: IUser
    }
  }
}
