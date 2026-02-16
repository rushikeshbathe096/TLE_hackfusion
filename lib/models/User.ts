import mongoose, { Schema, Model } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;

  email: string;
  password: string;
  name?: string;

  role: "citizen" | "authority" | "staff";
  department?: "Road" | "Water" | "Electrical" | "Sanitation";

  dob?: Date;
  phoneNumber?: string;
  address?: string;
  profileImage?: string;
  govtIdUrl?: string;

  isVerified: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: false,
  },

  name: {
    type: String,
  },

  role: {
    type: String,
    enum: ["citizen", "authority", "staff"],
    default: "citizen",
    required: true,
  },

  department: {
    type: String,
    enum: ["Road", "Water", "Electrical", "Sanitation"],
    required: function (this: IUser) {
      return this.role === "authority" || this.role === "staff";
    },
  },

  dob: {
    type: Date,
  },

  phoneNumber: {
    type: String,
  },

  address: {
    type: String,
  },

  profileImage: {
    type: String,
  },

  govtIdUrl: {
    type: String,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
