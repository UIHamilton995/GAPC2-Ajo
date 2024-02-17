import { DataTypes, Model } from "sequelize";
import { db } from "../config";
import Wallets from "./wallets";


enum category {
    SALARY = "salary",
    BONUS = "bonus",
    EMERGENCY_FUND = "emergency_fund",
    OTHER = "Other"
  }

enum source {
    EMPLOYER = "employer",
    BUSINESS = "business",
    OTHER = "Other"
  
}
  
export interface IncomeAttributes {
    id: string;
    wallet_id: string; // Wallet where the income was received
    amount: number;
    description: string; // Optional description for the income
    category: string; // Category of the income (e.g., salary, bonus, etc.)
    source: string; // Source of the income (e.g., employer, business, etc.)
    received_at: Date; // Date when the income was received
    created_at: Date;
    updated_at: Date;
  }


class Income extends Model<IncomeAttributes> {
    public id!: string;
    public wallet_id!: string;
    public amount!: number;
    public description!: string;
    public category!: string;
    public source!: string;
    public received_at!: Date;
    public created_at!: Date;
    public updated_at!: Date;
  }

  Income.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    wallet_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Wallets,
        key: "id",
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(category)),
      allowNull: false,
    },
    source: {
      type: DataTypes.ENUM(...Object.values(source)),
      allowNull: false,
    },
    received_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },{
    sequelize: db,
    tableName: "Incomes",
    modelName: "Incomes",
  })

    export default Income;