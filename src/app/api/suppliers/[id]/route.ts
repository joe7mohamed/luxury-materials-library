// app/api/suppliers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connection";
import User from "@/lib/db/models/user";
import Product from "@/lib/db/models/product";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    await dbConnect();

    // Get supplier
    const supplier = await User.findOne({
      _id: id,
      userType: "supplier",
      isActive: true,
    }).select("-password");

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    // Get supplier's products
    const products = await Product.find({
      supplier: id,
      isActive: true,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      supplier,
      products,
    });
  } catch (error: any) {
    console.error(`Error fetching supplier ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch supplier" },
      { status: 500 }
    );
  }
}
