// app/api/favorites/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import Favorite from '@/lib/db/models/favorite';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
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
    
    const favorites = await Favorite.find({ userId: user.id })
      .populate({
        path: 'productId',
        populate: [
          { path: 'supplier', select: 'name company' },
          { path: 'category', select: 'name' }
        ]
      });
    
    return NextResponse.json({
      favorites: favorites.map(fav => ({
        ...fav.productId.toObject(),
        favoriteId: fav._id
      }))
    });
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (user.userType !== 'projectOwner') {
      return NextResponse.json(
        { error: 'Only project owners can favorite products' },
        { status: 403 }
      );
    }
    
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      userId: user.id,
      productId
    });
    
    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Product already in favorites' },
        { status: 400 }
      );
    }
    
    // Create favorite
    const favorite = await Favorite.create({
      userId: user.id,
      productId
    });
    
    return NextResponse.json(
      { favorite },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add favorite' },
      { status: 500 }
    );
  }
}