// components/products/product-detail.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/use-auth';
import { Heart, MessageSquare, Share2, Building, Tag, ArrowLeft } from 'lucide-react';
import { toggleFavorite } from '@/lib/actions/favorite-actions';
import ModelViewer from './model-viewer';
import QuoteRequestForm from './quote-request-form';

interface ProductDetailProps {
  product: any;
  isFavorite: boolean;
}

export default function ProductDetail({ product, isFavorite }: ProductDetailProps) {
  const { user } = useAuth();
  const [favorite, setFavorite] = useState(isFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const handleToggleFavorite = async () => {
    if (!user || user.userType !== 'projectOwner') {
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleFavorite(product._id);
      setFavorite(result.isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/materials" 
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Materials
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl border border-border mb-4">
            <Image
              src={product.images[activeImageIndex] || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border ${
                    index === activeImageIndex ? 'border-primary' : 'border-border'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          
          {/* 3D Model Viewer (if available) */}
          {product.model3D && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">3D Model Preview</h3>
              <div className="aspect-video rounded-xl overflow-hidden border border-border">
                <ModelViewer modelUrl={product.model3D} />
              </div>
            </div>
          )}
        </div>
        
        {/* Product Information */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-3 mb-4">
            <Link
              href={`/suppliers/${product.supplier._id}`}
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Building size={16} className="mr-1" />
              {product.supplier.company || product.supplier.name}
            </Link>
            
            <div className="h-4 border-r border-border"></div>
            
            <Link
              href={`/categories/${product.category._id}`}
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Tag size={16} className="mr-1" />
              {product.category.name}
            </Link>
          </div>
          
          {product.pricing.priceRange && (
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-secondary/50 rounded-full text-sm font-medium">
                Price Range: {product.pricing.priceRange}
              </span>
            </div>
          )}
          
          <div className="prose prose-sm dark:prose-invert mb-8">
            <p className="text-muted-foreground whitespace-pre-line">
              {product.description}
            </p>
          </div>
          
          {/* Attributes */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            {user?.userType === 'projectOwner' && (
              <>
                <button
                  onClick={handleToggleFavorite}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full ${
                    favorite
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border hover:bg-secondary'
                  } transition-colors`}
                >
                  <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
                  <span>{favorite ? 'Saved' : 'Save'}</span>
                </button>
                
                <button
                  onClick={() => setShowQuoteForm(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <MessageSquare size={18} />
                  <span>Request Quote</span>
                </button>
              </>
            )}
            
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:bg-secondary transition-colors"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>
          
          {/* Supplier Information */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-lg font-medium mb-3">About the Supplier</h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center">
                <Building size={24} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium">{product.supplier.company || product.supplier.name}</h4>
                {product.supplier.businessDetails?.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                    {product.supplier.businessDetails.description}
                  </p>
                )}
                <Link
                  href={`/suppliers/${product.supplier._id}`}
                  className="inline-block mt-2 text-sm text-primary hover:underline"
                >
                  View Supplier Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quote Request Modal */}
      {showQuoteForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowQuoteForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Request a Quote</h2>
            <QuoteRequestForm 
              product={product} 
              onClose={() => setShowQuoteForm(false)} 
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}