// app/api/admin/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import User from '@/lib/db/models/user';
import Product from '@/lib/db/models/product';
import Category from '@/lib/db/models/category';
import QuoteRequest from '@/lib/db/models/quote';
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
    
    // Get counts
    const userCounts = await User.aggregate([
      { $group: { _id: '$userType', count: { $sum: 1 } } }
    ]);
    
    const formattedUserCounts = userCounts.reduce((acc: any, curr: any) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
    
    const productCounts = await Product.aggregate([
      { $group: { _id: '$isActive', count: { $sum: 1 } } }
    ]);
    
    const formattedProductCounts = {
      active: productCounts.find((p: any) => p._id === true)?.count || 0,
      pending: productCounts.find((p: any) => p._id === false)?.count || 0
    };
    
    const quoteCounts = await QuoteRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const formattedQuoteCounts = quoteCounts.reduce((acc: any, curr: any) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
    
    const categoryCount = await Category.countDocuments();
    
    // Get latest inactive suppliers for approval
    const pendingSuppliers = await User.find({ 
      userType: 'supplier',
      isActive: false
    })
    .select('name company createdAt')
    .sort({ createdAt: -1 })
    .limit(5);
    
    // Get latest products for approval
    const pendingProducts = await Product.find({ isActive: false })
      .populate('supplier', 'name company')
      .populate('category', 'name')
      .select('name supplier category createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    return NextResponse.json({
      users: {
        total: Object.values(formattedUserCounts).reduce((a: any, b: any) => a + b, 0),
        ...formattedUserCounts
      },
      products: {
        total: formattedProductCounts.active + formattedProductCounts.pending,
        ...formattedProductCounts
      },
      quotes: {
        total: Object.values(formattedQuoteCounts).reduce((a: any, b: any) => a + b, 0),
        ...formattedQuoteCounts
      },
      categories: categoryCount,
      pendingSuppliers,
      pendingProducts
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}