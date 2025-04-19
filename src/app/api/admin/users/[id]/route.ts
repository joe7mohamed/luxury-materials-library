// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import User from '@/lib/db/models/user';
import { getCurrentUser } from '@/lib/auth/session';

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const user = await getCurrentUser();
    
    if (!user || user.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const { isActive } = await request.json();
    
    if (isActive === undefined) {
      return NextResponse.json(
        { error: 'isActive field is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Find user
    const targetUser = await User.findById(id);
    
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update status
    targetUser.isActive = isActive;
    await targetUser.save();
    
    return NextResponse.json({
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        userType: targetUser.userType,
        isActive: targetUser.isActive
      },
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error: any) {
    console.error(`Error updating user ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}