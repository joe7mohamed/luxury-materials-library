// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import Category from '@/lib/db/models/category';
import Product from '@/lib/db/models/product';
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
    
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Get products in this category
    const products = await Product.find({ 
      category: id,
      isActive: true
    })
      .populate('supplier', 'name company')
      .limit(20)
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      category,
      products
    });
  } catch (error: any) {
    console.error(`Error fetching category ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch category' },
      { status: 500 }
    );
  }
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
    
    const body = await request.json();
    
    await dbConnect();
    
    // Validate request body
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    // Update category
    const category = await Category.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error: any) {
    console.error(`Error updating category ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const user = await getCurrentUser();
    
    if (!user || user.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    await dbConnect();
    
    // Check if category has products
    const productsCount = await Product.countDocuments({ category: id });
    
    if (productsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with associated products' },
        { status: 400 }
      );
    }
    
    // Delete category
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Category deleted successfully'
    });
  } catch (error: any) {
    console.error(`Error deleting category ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}