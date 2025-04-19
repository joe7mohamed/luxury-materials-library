// lib/actions/quote-actions.ts
"use server";

import { getCurrentUser } from "@/lib/auth/session";
import dbConnect from "@/lib/db/connection";
import QuoteRequest from "@/lib/db/models/quote";
import { revalidatePath } from "next/cache";

interface QuoteRequestData {
  productId: string;
  supplierId: string;
  message: string;
}

export async function createQuoteRequest(data: QuoteRequestData) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Authentication required");
    }

    if (user.userType !== "projectOwner") {
      throw new Error("Only project owners can request quotes");
    }

    await dbConnect();

    const quoteRequest = await QuoteRequest.create({
      projectOwnerId: user.id,
      supplierId: data.supplierId,
      productId: data.productId,
      message: data.message,
      status: "pending",
    });

    // Revalidate paths
    revalidatePath("/project-owner/quotes");

    return quoteRequest;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create quote request");
  }
}

export async function getUserQuoteRequests() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Authentication required");
    }

    await dbConnect();

    let query = {};

    if (user.userType === "projectOwner") {
      query = { projectOwnerId: user.id };
    } else if (user.userType === "supplier") {
      query = { supplierId: user.id };
    } else {
      throw new Error("Unauthorized");
    }

    const quoteRequests = await QuoteRequest.find(query)
      .populate("productId", "name images")
      .populate("supplierId", "name company")
      .populate("projectOwnerId", "name")
      .sort({ createdAt: -1 });

    return quoteRequests;
  } catch (error: any) {
    throw new Error(error.message || "Failed to get quote requests");
  }
}

export async function respondToQuoteRequest(
  quoteId: string,
  response: { message: string; price?: number }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Authentication required");
    }

    if (user.userType !== "supplier") {
      throw new Error("Only suppliers can respond to quotes");
    }

    await dbConnect();

    const quoteRequest = await QuoteRequest.findById(quoteId);

    if (!quoteRequest) {
      throw new Error("Quote request not found");
    }

    if (quoteRequest.supplierId.toString() !== user.id) {
      throw new Error("Unauthorized");
    }

    quoteRequest.response = {
      message: response.message,
      price: response.price,
    };

    quoteRequest.status = "responded";
    await quoteRequest.save();

    // Revalidate paths
    revalidatePath("/supplier/quotes");
    revalidatePath("/project-owner/quotes");

    return quoteRequest;
  } catch (error: any) {
    throw new Error(error.message || "Failed to respond to quote request");
  }
}

export async function closeQuoteRequest(quoteId: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Authentication required");
    }

    await dbConnect();

    const quoteRequest = await QuoteRequest.findById(quoteId);

    if (!quoteRequest) {
      throw new Error("Quote request not found");
    }

    if (
      user.userType !== "admin" &&
      quoteRequest.projectOwnerId.toString() !== user.id
    ) {
      throw new Error("Unauthorized");
    }

    quoteRequest.status = "closed";
    await quoteRequest.save();

    // Revalidate paths
    revalidatePath("/supplier/quotes");
    revalidatePath("/project-owner/quotes");

    return quoteRequest;
  } catch (error: any) {
    throw new Error(error.message || "Failed to close quote request");
  }
}
