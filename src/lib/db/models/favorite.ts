// lib/db/models/favorite.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IFavorite extends Document {
  userId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

// Ensure a user can only favorite a product once
FavoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

const FavoriteModel =
  mongoose.models.Favorite ||
  mongoose.model<IFavorite>("Favorite", FavoriteSchema);

export default FavoriteModel;
