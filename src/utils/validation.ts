import { createGroup } from './../controller/userController';

import bcrypt from "bcrypt";
import Joi from "joi";
import { start } from 'repl';

export const option = {
  abortearly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};
export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
  };
export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
  };
export const forgotPasswordSchema = Joi.object().keys({
    email:Joi.string().required()
})
export const resetPasswordSchema = Joi.object().keys({
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
      confirm_password: Joi.any().equal(Joi.ref('password')).required().label('confirm password')
})

export const createGroupSchema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    group_image: Joi.string().required(),
    contribution_amount: Joi.number().required(),
    amount_withdrawn: Joi.number().required(),
    number_of_participants: Joi.number().required(),
    frequency: Joi.string().required(),
    duration: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
})

export const  createSavingsSchema = Joi.object().keys({
  name: Joi.string().required(),
  target: Joi.string().required(),
  target_amount: Joi.number().required(),
  amount_saved: Joi.number().required(),
  frequency: Joi.string().required(),
  category: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required()
})

//SENDING OTP TO PHONE
export const accountSid = process.env.ACCOUNTSID;
export const authToken = process.env.AUTHTOKEN
export const fromAdminPhone = process.env.PHONEFROMADMIN as string

//SENDING OTP TO EMAIL
export const GMAIL_USER = process.env.GMAIL_USER
export const GMAIL_PASS = process.env.GMAIL_PASSWORD
export const MailFromAdmin = process.env.MailFromAdmin as string
export const userSubject = process.env.userSubject as string
export const APP_SECRET = process.env.APP_SECRET as string;
export const Base_Url = process.env.BASE_URL as string;
export const URL = process.env.URL as string;
export const port = process.env.PORT || 4000;