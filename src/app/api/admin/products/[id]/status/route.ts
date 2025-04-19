// app/api/admin/products/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import Product from '@/lib/db/models/product';
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
    
    // Find product
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Update status
    product.isActive = isActive;
    await product.save();
    
    return NextResponse.json({
      product,
      message: `Product ${isActive ? 'approved' : 'rejected'} successfully`
    });
  } catch (error: any) {
    console.error(`Error updating product status ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product status' },
      { status: 500 }
    );
  }
}