import Users, { UserAttributes } from "../models/users";
import { Request, Response } from "express";
import { APP_SECRET, Base_Url, MailFromAdmin, forgotPasswordSchema, resetPasswordSchema, userSubject ,option} from "../utils/validation";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { emailHtml2, mailSent2 } from "../utils/notification";


export const forgetPassword = async(req: Request, res: Response) => {
    try {
      console.log(req.body)
        const {email} = req.body;
        const validateResult = forgotPasswordSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
  }
       //check if the User exist
       const user = (await Users.findOne({
        where: { email: email },
      })) as unknown as UserAttributes;
    
   
    if(user){
    const secret = APP_SECRET + user.password;
     const token = jwt.sign({email: user.email, id: user.id},secret, {expiresIn: "10m"})
  
    const link = `${Base_Url}/users/resetpassword/${user.id}`
    if(token) {

      const html = emailHtml2(link);
      await mailSent2(MailFromAdmin, user.email, userSubject, html);

      return res.status(200).json({
        message: "password reset link sent to email",
        link
      });
    }
    return res.status(400).json({
            Error: "Invalid credentials",
        })
  }
  return res.status(400).json({
            message: "Email not found",
          })
        
  } catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/forgetpassword",
          }); 
    }
  }

  export const resetPasswordGet = async(req:Request, res:Response) => {
    const {id, token} = req.params;
    try {
    const user = (await Users.findOne({
        where: {id: id} 
    }))as unknown as UserAttributes;

    if(!user) {
        return res.status(400).json({
            message: "User Does Not Exist"
        })
    };

    const secret = APP_SECRET + user.password;

         const verify = jwt.verify(token, secret)
         return res.status(200).json({
            email: user.email,
            verify
             });

    } catch (error) {
      console.error(error);

      // Handle the verification error
      return res.status(401).json({
        message: 'Not Verified',
      });
    };
  };

  export const resetPasswordPost  = async( req:JwtPayload, res:Response) =>{
    const { id} = req.params;
    const {password} = req.body
    try {
    const user = (await Users.findOne({
        where: {id: id} 
    }))as unknown as UserAttributes

    const validateResult = resetPasswordSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
  }
    if(!user) {
        return res.status(400).json({
            message: "user does not exist"
        })
    };
           
       const encryptPassword = await bcrypt.hash(password,10)
       
       const updatedPassword =  (await Users.update(
        {
           password: encryptPassword
         }, {where: {id: id}}
         )) as unknown as UserAttributes
  
         return res.status(200).json({
            message: 'Password successfully changed',
            updatedPassword
  
          });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        Error: "Internal server Error",
        route: "/users/reset-password/:id/:token",
      }); 
    };
  };
  