import { Model, DataTypes } from "sequelize";
import Transactions from "./transactions";
import { db } from "../config";
import Savings from "./savings";


export enum role {
  ADMIN = "Admin",
  CONTRIBUTOR = "Contributor" // NORMAL USER
}

export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
  password: string;
  role: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  gender: string;
  occupation: string;
  date_of_birth: Date;
  bvn: string;
  savings: Savings[];  
  address: string;
  identification_number: string;
  identification_doc: string;
  proof_of_address_doc: string;
  otp: string | null;
}

class Users extends Model<UserAttributes> {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public profilePic!: string;
  public password!: string;
  public role!: string;
  public phone!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public gender!: string;
  public occupation!: string;
  public date_of_birth!: Date;
  public bvn!: string;
  public savings!: Savings[];
  public address!: string;
  public identification_number!: string;
  public identification_doc!: string;
  public proof_of_address_doc!: string;
  public otp!: string | null;
}

Users.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM(...Object.values(role)),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    bvn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    savings: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    identification_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    identification_doc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    proof_of_address_doc: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    sequelize: db,
    tableName: "Users",
    modelName: "Users",
    timestamps: false
  }
);



export default Users;

