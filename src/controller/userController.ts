import{Request, Response} from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Groups, { GroupAttributes } from "../models/groups";
import Users, { UserAttributes } from "../models/users";
import { createGroupSchema, createSavingsSchema, option } from "../utils/validation";
import { v4 as uuidv4 } from "uuid";
import Savings, { SavingAttributes } from "../models/savings";
import Wallets from "../models/wallets";
import Transactions from "../models/transactions";
import Income from "../models/income";
//Groups
export const createGroup = async (req: Request, res: Response) => {
    try {
     const id = req.params.id;
     const {title, description, group_image, contribution_amount, amount_withdrawn, number_of_participants, frequency, duration, startDate, endDate} = req.body;
     // Joi validation
     const validateResult = createGroupSchema.validate(req.body, option)
     if(validateResult.error) {
         return res.status(400).json({
             Error: validateResult.error.details[0].message
         })
     }
 
     const user = await Users.findOne({ where: { id: id } }) as unknown as UserAttributes;
     if (user) {
       const newGroup = await Groups.create({
        id: uuidv4(),
        title,
         description,
         admin_id: id,
         group_image,
         amount_contributed: 0,
         contribution_amount,
         group_transactions: [],
         amount_withdrawn,
         members: [],
         slots: [],
         availableSlots: [],
         number_of_participants, 
         frequency,
         duration,
         startDate,
         endDate,
         created_at: new Date(), // Set the current timestamp
       })
       return res.status(201).json({
         message: "Group created successfully",
         newGroup,
       });
     }
     
     return res.status(400).json({
         message: "User not found",
       });
    } catch(error) {
     console.error(error);
     res.status(500).json({
       Error: "Internal server Error",
       route: "/users/createGroup",
     }); 
    }
 }

export const getGroups = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user = await Users.findOne({ where: { id: id } }) as unknown as UserAttributes;
     if(user){
        const groups = await Groups.findAll();
        return res.status(200).json({
          groups,
        });
     }
        return res.status(400).json({
            message: "User not found",
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        Error: "Internal server Error",
        route: "/users/getGroups",
      });
    }
  };

export const getGroup = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const groupId = req.params.groupId;
        
        const user = await Users.findOne({ where: { id: userId } }) as unknown as UserAttributes;
        if (user) {
            const group = await Groups.findOne({ where: { id: groupId, members: { id: userId } } });
            if (group) {
                return res.status(200).json({
                    group,
                });
            } else {
                return res.status(404).json({
                    message: "User is not a member of this group.",
                });
            }
        } else {
            return res.status(404).json({
                message: "User not found.",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/getGroup",
        });
    }
}

// Savings
export const createSavings = async (req: Request, res: Response) => {
    try {
     const id = req.params.id;
     const uuiduser = uuidv4();
     const {name,target,target_amount, category, frequency, startDate, endDate} = req.body;
     // Joi validation
     const validateResult = createSavingsSchema.validate(req.body, option)
     if(validateResult.error) {
         return res.status(400).json({
             Error: validateResult.error.details[0].message
         })
     }
 
     const user = await Users.findOne({ where: { id: id } }) as unknown as UserAttributes;
     if (user) {
       const newsaving = await Savings.create({
        id: uuiduser,
        user_id: id,
        group_id:"",
        name,
        target,
        target_amount,
        amount_saved: 0,
        frequency,
        category,
        startDate,
        endDate,
        created_at: new Date(), // Set the current timestamp
       })
       return res.status(201).json({
         message: "Savings created successfully",
         newsaving,
       });
     }
     
     return res.status(400).json({
         message: "User not found",
       });
    } catch(error) {
     console.error(error);
     res.status(500).json({
       Error: "Internal server Error",
       route: "/users/createsavings",
     }); 
    }
 }

 export const getPersonalSavings = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const user = await Users.findOne({ where: { id: userId } }) as unknown as UserAttributes;
        if (user) {
            const totalSavings = await Savings.sum('target', { where: { user_id: userId } });
            return res.status(200).json({
                totalSavings,
            });
        }
        return res.status(400).json({
            message: "User not found",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/getPersonalSavings",
        });
    }
}

export const getGroupTotalSavings = async (req: Request, res: Response) => {
    try {
        const groupId = req.params.groupId;
        const group = await Groups.findOne({ where: { id: groupId } });
        if (group) {
            const totalSavings = await Savings.sum('target', { where: { id: groupId } });
            return res.status(200).json({
                totalSavings,
            });
        }
        return res.status(400).json({
            message: "Group not found",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/groups/getGroupTotalSavings",
        });
    }
}

export const getUserContributions = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        // Find the user and ensure it exists
        const user = await Users.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Retrieve all contributions made by the user
        const contributions = await Savings.findAll({ where: { user_id: userId } });

        return res.status(200).json({ contributions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ Error: "Internal server error", route: "/users/getUserContributions" });
    }
};

// Transactions
export const getTransactionHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        // Find the user and ensure it exists
        const user = await Users.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the user's wallet
        const wallet = await Wallets.findOne({ where: { user_id: userId } });
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        // Fetch transaction history associated with the user's wallet
        const transactions = await Transactions.findAll({ where: { wallet_id: wallet.id } });

        return res.status(200).json({ transactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({
             Error: "Internal server error",
             route: "/users/getTransactionHistory" });
    }
};

// Wallet
export const createWallet = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        // Find the user and ensure it exists
        const user = await Users.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user already has a wallet
        const existingWallet = await Wallets.findOne({ where: { user_id: userId } });
        if (existingWallet) {
            return res.status(400).json({ message: "User already has a wallet" });
        }

        // Create a new wallet for the user
        const newWallet = await Wallets.create({
            id: uuidv4(),
            user_id: userId, 
            total_amount: 0,
            total_group_savings:0,
            total_income:0,
            total_personal_savings:0,
            earnings:[],
            created_at: new Date(),
            type:"default"
            });

        return res.status(201).json({ 
            message: "Wallet created successfully",
             wallet: newWallet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            Error: "Internal server error", 
            route: "/users/createWallet" });
    }
};

export const updatedWallet = async (req: Request, res: Response) => {
    try{
        const userId = req.params.userId;
        const {type} = req.body;
        const user = await Users.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const wallet = await Wallets.findOne({ where: { user_id: userId } });
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        const updatedWallet = await wallet.update({
            type
        });
        return res.status(200).json({
             message: "Wallet updated successfully",
             wallet: updatedWallet });

    }catch(error){
        console.error(error);
        res.status(500).json({
             Error: "Internal server error", 
             route: "/users/updatedWallet" });
    
    }
}    
//Total income
export const getTotalIncome = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        // Find the user and ensure it exists
        const user = await Users.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the user's wallet
        const wallet = await Wallets.findOne({ where: { user_id: userId } });
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found for the user" });
        }

        // Get the total income associated with the user's wallet
        const totalIncome = await Income.sum('amount', { where: { wallet_id: wallet.id } });

        return res.status(200).json({ totalIncome });
    } catch (error) {
        console.error(error);
        res.status(500).json({
             Error: "Internal server error", 
             route: "/users/getTotalIncome" });
    }
};


// Goals
export const getUserGoals = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        // Find the user and ensure it exists
        const user = await Users.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find all distinct categories (goals) associated with the user's savings
        const distinctCategories = await Savings.aggregate('category', 'DISTINCT', { plain: false, where: { user_id: userId } }) as unknown as SavingAttributes[];

        // Extract category values from the result
        const categories = distinctCategories.map((category: any) => category.DISTINCT);

        return res.status(200).json({ categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({
             Error: "Internal server error",
             route: "/users/getUserGoals" });
    }
};







