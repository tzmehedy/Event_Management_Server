import  httpStatusCode  from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authServices } from './auth.services';
import { setCookies } from '../../utils/setCookies';

const credentialsLogin = catchAsync(
  async (req: Request, res: Response) => {

    const loginInfo = await authServices.credentialsLogin(req.body);
    
    await setCookies(res, loginInfo.userTokens)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "The user login successfully...",
      data: loginInfo,
    });
  }
);


const logOut = catchAsync(async(req:Request,res:Response)=>{
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure:true,
        sameSite: "none"
    })
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Logged Out Successfully",
      data: null,
    });
})

export const authControllers = {
    credentialsLogin,
    logOut
}