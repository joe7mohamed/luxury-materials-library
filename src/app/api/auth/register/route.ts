// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import User from '@/lib/db/models/user';
import { z } from 'zod';

// Base schema for registration
const baseRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  userType: z.enum(["projectOwner", "supplier"]),
  company: z.string().optional(),
  phone: z.string().optional(),
});

// Schema for project owner
const projectOwnerSchema = baseRegistrationSchema.extend({
  userType: z.literal("projectOwner"),
});

// Schema for supplier
const supplierSchema = baseRegistrationSchema.extend({
  userType: z.literal("supplier"),
  company: z.string().min(1, "Company name is required"),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
  businessDetails: z.object({
    businessType: z.string().min(1, "Business type is required"),
    description: z.string().optional(),
    website: z.string().optional(),
    establishedYear: z.number().optional(),
  }).optional(),
});

// Combined schema using discriminated union
const registrationSchema = z.discriminatedUnion("userType", [
  projectOwnerSchema,
  supplierSchema,
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body against schema
    const validationResult = registrationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const userData = validationResult.data;
    
    await dbConnect();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = await User.create(userData);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user.toObject();
    
    return NextResponse.json(
      { 
        user: userWithoutPassword,
        message: userData.userType === 'supplier' 
          ? "Registration successful. Your account is pending approval."
          : "Registration successful" 
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}