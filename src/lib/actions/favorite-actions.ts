// lib/actions/favorite-actions.ts
"use server";

import { getCurrentUser } from "@/lib/auth/session";
import dbConnect from "@/lib/db/connection";
import Favorite from "@/lib/db/models/favorite";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(productId: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Authentication required");
    }

    if (user.userType !== "projectOwner") {
      throw new Error("Only project owners can favorite products");
    }

    await dbConnect();

    // Check if product is already favorited
    const existingFavorite = await Favorite.findOne({
      userId: user.id,
      productId,
    });

    let isFavorite: boolean;

    if (existingFavorite) {
      // Remove favorite
      await Favorite.findByIdAndDelete(existingFavorite._id);
      isFavorite = false;
    } else {
      // Add favorite
      await Favorite.create({
        userId: user.id,
        productId,
      });
      isFavorite = true;
    }

    // Revalidate paths
    revalidatePath("/materials");
    revalidatePath(`/products/${productId}`);
    revalidatePath("/project-owner/favorites");

    return { isFavorite };
  } catch (error: any) {
    throw new Error(error.message || "Failed to toggle favorite");
  }
}

export async function getUserFavorites() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Authentication required");
    }

    await dbConnect();

    const favorites = await Favorite.find({ userId: user.id }).populate({
      path: "productId",
      populate: [
        { path: "supplier", select: "name company" },
        { path: "category", select: "name" },
      ],
    });

    return favorites.map((fav) => ({
      ...fav.productId.toObject(),
      favoriteId: fav._id,
    }));
  } catch (error: any) {
    throw new Error(error.message || "Failed to get favorites");
  }
}
