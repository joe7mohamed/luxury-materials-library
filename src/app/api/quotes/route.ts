// app/api/quotes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import QuoteRequest from '@/lib/db/models/quote';
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
    
    await dbConnect();
    
    // Determine query based on user type
    let query: any = {};
    
    if (user.userType === 'projectOwner') {
      query.projectOwnerId = user.id;
    } else if (user.userType === 'supplier') {
      query.supplierId = user.id;
    } else if (user.userType === 'admin') {
      // Admins can see all quotes
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');
      
      if (userId) {
        // Get quotes for specific user if provided
        const userQuery = await getQueryForUser(userId);
        if (userQuery) {
          query = userQuery;
        }
      }
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Add status filter if provided
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    if (status && ['pending', 'responded', 'closed'].includes(status)) {
      query.status = status;
    }
    
    const quotes = await QuoteRequest.find(query)
      .populate('projectOwnerId', 'name email')
      .populate('supplierId', 'name company')
      .populate('productId', 'name images')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ quotes });
  } catch (error: any) {
    console.error('Error fetching quote requests:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch quote requests' },
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
        { error: 'Only project owners can request quotes' },
        { status: 403 }
      );
    }
    
    const { productId, supplierId, message } = await request.json();
    
    if (!productId || !supplierId || !message) {
      return NextResponse.json(
        { error: 'Product ID, supplier ID, and message are required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Create quote request
    const quoteRequest = await QuoteRequest.create({
      projectOwnerId: user.id,
      supplierId,
      productId,
      message,
      status: 'pending'
    });
    
    return NextResponse.json(
      { quoteRequest },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating quote request:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create quote request' },
      { status: 500 }
    );
  }
}

// Helper function to get query based on user ID
async function getQueryForUser(userId: string) {
  try {
    // This would need to fetch the user to determine their type
    const User = require('@/lib/db/models/user').default;
    const user = await User.findById(userId);
    
    if (!user) return null;
    
    if (user.userType === 'projectOwner') {
      return { projectOwnerId: userId };
    } else if (user.userType === 'supplier') {
      return { supplierId: userId };
    }
    
    return null;
  } catch (error) {
    return null;
  }
}