// components/products/product-filter.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ChevronDown, 
  Filter, 
  X, 
  Check, 
  Search
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

interface Supplier {
  _id: string;
  name: string;
  company: string;
}

interface FilterOption {
  _id: string;
  name: string;
  count?: number;
}

interface ProductFilterProps {
  categories: Category[];
  suppliers: Supplier[];
  productCount: number;
}

export default function ProductFilter({
  categories,
  suppliers,
  productCount
}: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: searchParams.get('category') || '',
    supplier: searchParams.get('supplier') || '',
    priceRange: searchParams.get('priceRange') || ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Price range options
  const priceRanges = [
    { _id: '$', name: '$ (Budget)' },
    { _id: '$$', name: '$$ (Standard)' },
    { _id: '$$$', name: '$$$ (Premium)' },
    { _id: '$$$$', name: '$$$$ (Luxury)' }
  ];

  // Format suppliers for display
  const formattedSuppliers = suppliers.map(supplier => ({
    _id: supplier._id,
    name: supplier.company || supplier.name
  }));

  useEffect(() => {
    // Initialize search term from URL
    const querySearch = searchParams.get('search') || '';
    setSearchTerm(querySearch);
    
    // Initialize active filters from URL
    setActiveFilters({
      category: searchParams.get('category') || '',
      supplier: searchParams.get('supplier') || '',
      priceRange: searchParams.get('priceRange') || ''
    });
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search: searchTerm });
  };

  const handleFilterChange = (type: string, value: string) => {
    const newFilters = {
      ...activeFilters,
      [type]: activeFilters[type as keyof typeof activeFilters] === value ? '' : value
    };
    
    setActiveFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({
      category: '',
      supplier: '',
      priceRange: ''
    });
    setSearchTerm('');
    
    // Reset URL to base path
    router.push('/materials');
  };

  const applyFilters = (filters: any) => {
    // Combine existing filters with new ones
    const newFilters = { ...activeFilters, ...filters };
    
    // Build query string
    const params = new URLSearchParams();
    
    if (newFilters.search && newFilters.search.trim()) {
      params.set('search', newFilters.search.trim());
    }
    
    if (newFilters.category) {
      params.set('category', newFilters.category);
    }
    
    if (newFilters.supplier) {
      params.set('supplier', newFilters.supplier);
    }
    
    if (newFilters.priceRange) {
      params.set('priceRange', newFilters.priceRange);
    }
    
    // Update URL
    const queryString = params.toString();
    router.push(`/materials${queryString ? `?${queryString}` : ''}`);
  };

  const hasActiveFilters = !!activeFilters.category || !!activeFilters.supplier || !!activeFilters.priceRange || !!searchTerm;

  const FilterSection = ({ 
    title, 
    options, 
    activeValue,
    filterType 
  }: { 
    title: string, 
    options: FilterOption[], 
    activeValue: string,
    filterType: string
  }) => (
    <div className="py-4 border-b border-border">
      <h3 className="font-medium mb-3">{title}</h3>
      <ul className="space-y-2">
        {options.map((option) => (
          <li key={option._id}>
            <button
              onClick={() => handleFilterChange(filterType, option._id)}
              className="flex items-center w-full text-left hover:text-primary transition-colors"
            >
              <span className={`w-5 h-5 border ${
                activeValue === option._id 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-border'
              } rounded flex items-center justify-center mr-2`}>
                {activeValue === option._id && <Check size={14} />}
              </span>
              <span className={activeValue === option._id ? 'font-medium' : ''}>
                {option.name}
              </span>
              {option.count !== undefined && (
                <span className="ml-auto text-muted-foreground text-sm">
                  ({option.count})
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Materials</h2>
          <p className="text-muted-foreground">
            {productCount} {productCount === 1 ? 'product' : 'products'} available
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
          <div className="relative w-full sm:w-64 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-border focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <button 
            type="submit"
            className="ml-2 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            <Search size={20} />
          </button>
        </form>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary/70 rounded-full transition-colors"
        >
          <Filter size={18} />
          <span>Filter</span>
          <ChevronDown size={16} className={`transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {activeFilters.category && (
          <div className="flex items-center gap-1 px-3 py-1.5 bg-secondary/50 rounded-full text-sm">
            <span>Category: {categories.find(c => c._id === activeFilters.category)?.name}</span>
            <button 
              onClick={() => handleFilterChange('category', activeFilters.category)}
              className="ml-1 p-0.5 hover:bg-secondary/70 rounded-full"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {activeFilters.supplier && (
          <div className="flex items-center gap-1 px-3 py-1.5 bg-secondary/50 rounded-full text-sm">
            <span>Supplier: {formattedSuppliers.find(s => s._id === activeFilters.supplier)?.name}</span>
            <button 
              onClick={() => handleFilterChange('supplier', activeFilters.supplier)}
              className="ml-1 p-0.5 hover:bg-secondary/70 rounded-full"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {activeFilters.priceRange && (
          <div className="flex items-center gap-1 px-3 py-1.5 bg-secondary/50 rounded-full text-sm">
            <span>Price: {priceRanges.find(p => p._id === activeFilters.priceRange)?.name}</span>
            <button 
              onClick={() => handleFilterChange('priceRange', activeFilters.priceRange)}
              className="ml-1 p-0.5 hover:bg-secondary/70 rounded-full"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {searchTerm && (
          <div className="flex items-center gap-1 px-3 py-1.5 bg-secondary/50 rounded-full text-sm">
            <span>Search: {searchTerm}</span>
            <button 
              onClick={() => {
                setSearchTerm('');
                applyFilters({ search: '' });
              }}
              className="ml-1 p-0.5 hover:bg-secondary/70 rounded-full"
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      
      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-card rounded-lg border border-border mb-8">
          <FilterSection
            title="Categories"
            options={categories}
            activeValue={activeFilters.category}
            filterType="category"
          />
          
          <FilterSection
            title="Suppliers"
            options={formattedSuppliers}
            activeValue={activeFilters.supplier}
            filterType="supplier"
          />
          
          <FilterSection
            title="Price Range"
            options={priceRanges}
            activeValue={activeFilters.priceRange}
            filterType="priceRange"
          />
        </div>
      )}
    </div>
  );
}