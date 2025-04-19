// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import Product from '@/lib/db/models/product';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || user.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    await dbConnect();
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const supplier = searchParams.get('supplier');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // Build query
    const query: any = {};
    
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    if (supplier) {
      query.supplier = supplier;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const products = await Product.find(query)
      .populate('supplier', 'name company')
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}