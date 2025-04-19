// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import Product from '@/lib/db/models/product';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const category = searchParams.get('category');
    const supplier = searchParams.get('supplier');
    const search = searchParams.get('search');
    const priceRange = searchParams.get('priceRange');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    // Build query
    const query: any = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (supplier) {
      query.supplier = supplier;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (priceRange) {
      query['pricing.priceRange'] = priceRange;
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    await dbConnect();
    
    // Execute query
    const products = await Product.find(query)
      .populate('supplier', 'name company businessDetails.logo')
      .populate('category', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await Product.countDocuments(query);
    
    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
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
    
    if (user.userType !== 'supplier') {
      return NextResponse.json(
        { error: 'Only suppliers can create products' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body
    if (!body.name || !body.description || !body.category) {
      return NextResponse.json(
        { error: 'Name, description, and category are required' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    // Create product
    const product = await Product.create({
      ...body,
      supplier: user.id,
      isActive: false // Needs approval
    });
    
    return NextResponse.json(
      { 
        product,
        message: 'Product created successfully and pending approval' 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}