import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
    let status_code = 5000
    let message = "Something went wrong...."

    if(err instanceof AppError){
        status_code = err.status_code
        message = err.message
    }

    res.send({
        success: true,
        status_code,
        message,
        err
    })
}
