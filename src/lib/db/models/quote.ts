// lib/db/models/quote.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IQuoteRequest extends Document {
  projectOwnerId: Schema.Types.ObjectId;
  supplierId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  response?: {
    message?: string;
    price?: number;
    attachments?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const QuoteRequestSchema = new Schema<IQuoteRequest>(
  {
    projectOwnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project owner ID is required'],
    },
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Supplier ID is required'],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'responded', 'closed'],
      default: 'pending',
    },
    response: {
      message: String,
      price: Number,
      attachments: [String],
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

const QuoteRequestModel = mongoose.models.QuoteRequest || mongoose.model<IQuoteRequest>('QuoteRequest', QuoteRequestSchema);

export default QuoteRequestModel;