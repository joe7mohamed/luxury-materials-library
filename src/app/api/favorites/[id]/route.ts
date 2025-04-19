// app/api/favorites/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import Favorite from '@/lib/db/models/favorite';
import { getCurrentUser } from '@/lib/auth/session';

interface Params {
  params: {
    id: string;
  };
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (user.userType !== 'projectOwner') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    await dbConnect();
    
    // Find the favorite
    const favorite = await Favorite.findById(id);
    
    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }
    
    // Check ownership
    if (favorite.userId.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Delete favorite
    await Favorite.findByIdAndDelete(id);
    
    return NextResponse.json({
      message: 'Favorite removed successfully'
    });
  } catch (error: any) {
    console.error(`Error removing favorite ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
