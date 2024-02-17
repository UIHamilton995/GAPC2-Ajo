import { Request, Response } from "express";
import { APP_SECRET, Base_Url, MailFromAdmin, forgotPasswordSchema, resetPasswordSchema, userSubject ,option} from "../utils/validation";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { emailHtml2, mailSent2 } from "../utils/notification";
import { v4 as uuidv4 } from 'uuid';
import Users, { UserAttributes, role } from '../models/users';


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
  

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received request body:', req.body)

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      gender,
      occupation,
      date_of_birth,
    } = req.body || {};
    
    // Ensure that req.body exists and has the expected properties
    if (!req.body || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
      res.status(400).json({ error: 'Invalid request body' });
      return;
    }

    // Check if the user with the provided email already exists
    const existingUser = await Users.findOne({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique ID for the user
    const userId = uuidv4();

    // Create a new user with the necessary properties
    const newUser: UserAttributes = await Users.create({
      id: userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role.CONTRIBUTOR, // Default role for a new user
      phone,
      gender,
      occupation,
      date_of_birth
    } as Omit<UserAttributes, 'otp'>); // Cast to the appropriate type

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find the user with the provided email
    const user = await Users.findOne({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return;
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return;
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

    res.status(200).json({
      status: "success",
      method: req.method,
      message: "Login Successful",
      token,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

