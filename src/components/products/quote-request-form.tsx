// components/products/quote-request-form.tsx
'use client';

import React, { useState } from 'react';
import { createQuoteRequest } from '@/lib/actions/quote-actions';
import { SendHorizontal } from 'lucide-react';

interface QuoteRequestFormProps {
  product: any;
  onClose: () => void;
}

export default function QuoteRequestForm({ product, onClose }: QuoteRequestFormProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter a message for the supplier');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await createQuoteRequest({
        productId: product._id,
        supplierId: product.supplier._id,
        message: message.trim()
      });
      
      setSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error: any) {
      setError(error.message || 'Failed to send quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {!success ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-4">
              Send a message to the supplier to request a quote for this product. Include any specific requirements or questions you may have.
            </p>
            
            <div className="mb-2">
              <span className="text-sm font-medium">Product</span>
              <p className="text-muted-foreground">{product.name}</p>
            </div>
            
            <div className="mb-4">
              <span className="text-sm font-medium">Supplier</span>
              <p className="text-muted-foreground">{product.supplier.company || product.supplier.name}</p>
            </div>
            
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message*
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Describe your requirements in detail..."
              className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-full hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Request'}
              <SendHorizontal size={16} />
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center p-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <SendHorizontal size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Quote Request Sent!</h3>
          <p className="text-muted-foreground mb-4">
            Your request has been sent to {product.supplier.company || product.supplier.name}. They will respond to you soon.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}