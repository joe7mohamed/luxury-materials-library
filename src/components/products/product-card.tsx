// components/products/product-card.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/use-auth';
import { toggleFavorite } from '@/lib/actions/favorite-actions';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    images: string[];
    category: {
      _id: string;
      name: string;
    };
    supplier: {
      _id: string;
      name: string;
      company: string;
    };
    pricing: {
      priceRange?: string;
      customQuote: boolean;
    };
  };
  isFavorite?: boolean;
}

export default function ProductCard({ product, isFavorite = false }: ProductCardProps) {
  const { user } = useAuth();
  const [favorite, setFavorite] = React.useState(isFavorite);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    if (user.userType !== 'projectOwner') {
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
    <Link href={`/products/${product._id}`}>
      <div className="luxury-card group-hover:border-gold/30 overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {user?.userType === 'projectOwner' && (
            <button
              onClick={handleToggleFavorite}
              disabled={isLoading}
              className={cn(
                "absolute top-3 right-3 z-20 p-2 rounded-full",
                favorite 
                  ? "bg-primary/90 text-white" 
                  : "bg-black/30 text-white hover:bg-black/60",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <Heart size={18} fill={favorite ? "currentColor" : "none"} />
            </button>
          )}
          
          <div className="absolute bottom-3 left-3 z-20">
            <span className="px-2 py-1 text-xs rounded-full bg-background/90 backdrop-blur-sm">
              {product.category.name}
            </span>
          </div>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.pricing.priceRange && (
              <span className="text-sm font-medium text-muted-foreground">
                {product.pricing.priceRange}
              </span>
            )}
          </div>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-sm text-muted-foreground">
              By <span className="font-medium">{product.supplier.company || product.supplier.name}</span>
            </span>
            
            <div className="flex items-center text-sm font-medium text-primary group-hover:text-gold transition-colors">
              View Details
              <ExternalLink className="ml-1 h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}