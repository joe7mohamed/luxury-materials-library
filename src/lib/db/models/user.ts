// lib/db/models/user.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  userType: "projectOwner" | "supplier" | "admin";
  name: string;
  company?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  businessDetails?: {
    businessType?: string;
    category?: Schema.Types.ObjectId[];
    description?: string;
    logo?: string;
    website?: string;
    establishedYear?: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    userType: {
      type: String,
      enum: ["projectOwner", "supplier", "admin"],
      required: [true, "User type is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      country: String,
      postalCode: String,
    },
    businessDetails: {
      businessType: String,
      category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
      description: String,
      logo: String,
      website: String,
      establishedYear: Number,
    },
    isActive: {
      type: Boolean,
      default: function (this: any) {
        return this.userType !== "supplier"; // Suppliers need approval
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Delete the User model if it exists to prevent overwrite warning
const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
