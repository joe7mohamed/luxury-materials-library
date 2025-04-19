// lib/db/models/product.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  supplier: Schema.Types.ObjectId;
  category: Schema.Types.ObjectId;
  images: string[];
  model3D?: string;
  attributes: any;
  pricing: {
    priceRange?: string;
    customQuote: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Supplier is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    images: [String],
    model3D: String,
    attributes: {
      type: Schema.Types.Mixed,
      default: {},
    },
    pricing: {
      priceRange: String,
      customQuote: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: false, // Needs approval
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create text index for search
ProductSchema.index({ name: 'text', description: 'text' });

const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel;