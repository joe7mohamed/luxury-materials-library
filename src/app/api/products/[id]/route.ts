// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import Product from '@/lib/db/models/product';
import Favorite from '@/lib/db/models/favorite';
import { getCurrentUser } from '@/lib/auth/session';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    await dbConnect();
    
    const product = await Product.findById(id)
      .populate('supplier', 'name company businessDetails')
      .populate('category', 'name');
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if product is active or belongs to the current user
    const user = await getCurrentUser();
    
    if (!product.isActive && 
        (!user || 
         (user.userType !== 'admin' && 
          product.supplier._id.toString() !== user.id))) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if product is favorited by the current user
    let isFavorite = false;
    
    if (user && user.userType === 'projectOwner') {
      const favorite = await Favorite.findOne({
        userId: user.id,
        productId: id
      });
      
      isFavorite = !!favorite;
    }
    
    return NextResponse.json({
      product,
      isFavorite
    });
  } catch (error: any) {
    console.error(`Error fetching product ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
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
    
    await dbConnect();
    
    // Find product
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check ownership or admin
    if (product.supplier.toString() !== user.id && user.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Update product
    Object.keys(body).forEach(key => {
      if (key !== '_id' && key !== 'supplier') {
        (product as any)[key] = body[key];
      }
    });
    
    // If supplier updates, set isActive to false for review
    if (user.userType === 'supplier') {
      product.isActive = false;
    }
    
    await product.save();
    
    return NextResponse.json({
      product,
      message: user.userType === 'supplier' 
        ? 'Product updated and pending approval' 
        : 'Product updated successfully'
    });
  } catch (error: any) {
    console.error(`Error updating product ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
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
    
    await dbConnect();
    
    // Find product
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check ownership or admin
    if (product.supplier.toString() !== user.id && user.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    await Product.findByIdAndDelete(id);
    
    return NextResponse.json({
      message: 'Product deleted successfully'
    });
  } catch (error: any) {
    console.error(`Error deleting product ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}