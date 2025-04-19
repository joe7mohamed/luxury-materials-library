// app/api/suppliers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import User from '@/lib/db/models/user';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get active suppliers
    const suppliers = await User.find({ 
      userType: 'supplier',
      isActive: true
    })
    .select('name company businessDetails')
    .sort({ company: 1 });
    
    return NextResponse.json({ suppliers });
  } catch (error: any) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch suppliers' },
      { status: 500 }
    );
  }
}