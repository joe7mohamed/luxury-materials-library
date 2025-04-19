// lib/db/models/category.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  image?: string;
  parentCategory?: Schema.Types.ObjectId;
  attributes?: Array<{
    name: string;
    type: string;
    options?: string[];
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    attributes: [
      {
        name: String,
        type: String,
        options: [String],
      },
    ],
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

const CategoryModel = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default CategoryModel;