// app/api/quotes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import QuoteRequest from '@/lib/db/models/quote';
import { getCurrentUser } from '@/lib/auth/session';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const quote = await QuoteRequest.findById(id)
      .populate('projectOwnerId', 'name email phone')
      .populate('supplierId', 'name company businessDetails')
      .populate('productId');
    
    if (!quote) {
      return NextResponse.json(
        { error: 'Quote request not found' },
        { status: 404 }
      );
    }
    
    // Check if user has permission to view this quote
    if (
      user.userType !== 'admin' && 
      quote.projectOwnerId._id.toString() !== user.id && 
      quote.supplierId._id.toString() !== user.id
    ) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ quote });
  } catch (error: any) {
    console.error(`Error fetching quote request ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch quote request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { action, response } = body;
    
    await dbConnect();
    
    const quote = await QuoteRequest.findById(id);
    
    if (!quote) {
      return NextResponse.json(
        { error: 'Quote request not found' },
        { status: 404 }
      );
    }
    
    // Handle response action (supplier)
    if (action === 'respond') {
      if (user.userType !== 'supplier' || quote.supplierId.toString() !== user.id) {
        return NextResponse.json(
          { error: 'Only the supplier can respond to this quote' },
          { status: 403 }
        );
      }
      
      if (!response || !response.message) {
        return NextResponse.json(
          { error: 'Response message is required' },
          { status: 400 }
        );
      }
      
      quote.response = {
        message: response.message,
        price: response.price,
        attachments: response.attachments || []
      };
      quote.status = 'responded';
    }
    // Handle close action (project owner or admin)
    else if (action === 'close') {
      if (
        user.userType !== 'admin' && 
        (user.userType !== 'projectOwner' || quote.projectOwnerId.toString() !== user.id)
      ) {
        return NextResponse.json(
          { error: 'Only the project owner or admin can close this quote' },
          { status: 403 }
        );
      }
      
      quote.status = 'closed';
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
    
    await quote.save();
    
    return NextResponse.json({ 
      quote,
      message: action === 'respond' ? 'Response sent successfully' : 'Quote request closed'
    });
  } catch (error: any) {
    console.error(`Error updating quote request ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to update quote request' },
      { status: 500 }
    );
  }
}
