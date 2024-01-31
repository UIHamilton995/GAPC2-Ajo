import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import Users, { UserAttributes, role } from '../models/users';

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
