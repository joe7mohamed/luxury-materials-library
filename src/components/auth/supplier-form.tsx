// components/auth/supplier-form.tsx
import React, { useState } from 'react';

interface SupplierData {
  company: string;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  businessDetails: {
    businessType: string;
    description: string;
    website: string;
    establishedYear: number;
  };
}

interface SupplierFormProps {
  data: SupplierData;
  onChange: (data: Partial<SupplierData>) => void;
  errors?: Record<string, string>;
}

export default function SupplierForm({
  data,
  onChange,
  errors = {}
}: SupplierFormProps) {
  const [formErrors, setFormErrors] = useState<Record<string, string>>(errors);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      
      if (parentKey === 'address') {
        onChange({
          address: {
            ...data.address,
            [childKey]: value
          }
        });
      } else if (parentKey === 'businessDetails') {
        onChange({
          businessDetails: {
            ...data.businessDetails,
            [childKey]: childKey === 'establishedYear' ? Number(value) : value
          }
        });
      }
    } else {
      onChange({ [name]: value });
    }
    
    // Clear field error when typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const businessTypes = [
    'Door Supplier',
    'Staircase Manufacturer',
    'Aluminum & Glass Supplier',
    'Toilet & Sanitary Supplier',
    'Accessories & Arts',
    'CCTV & Sound System',
    'Flooring Supplier',
    'Wall Finishes',
    'Furniture',
    'Lighting',
    'Swimming Pool',
    'Kitchen',
    'Outdoor & Landscaping',
    'Textiles & Fabrics',
    'Other'
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">Supplier Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-1">
            Company Name*
          </label>
          <input
            id="company"
            name="company"
            type="text"
            required
            className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-primary focus:outline-none ${
              formErrors.company ? 'border-destructive' : 'border-border'
            }`}
            value={data.company}
            onChange={handleInputChange}
          />
          {formErrors.company && (
            <p className="mt-1 text-sm text-destructive">{formErrors.company}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number*
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-primary focus:outline-none ${
              formErrors.phone ? 'border-destructive' : 'border-border'
            }`}
            value={data.phone}
            onChange={handleInputChange}
          />
          {formErrors.phone && (
            <p className="mt-1 text-sm text-destructive">{formErrors.phone}</p>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-3">Business Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="businessDetails.businessType" className="block text-sm font-medium mb-1">
              Business Type*
            </label>
            <select
              id="businessDetails.businessType"
              name="businessDetails.businessType"
              required
              className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-primary focus:outline-none ${
                formErrors['businessDetails.businessType'] ? 'border-destructive' : 'border-border'
              }`}
              value={data.businessDetails.businessType}
              onChange={handleInputChange}
            >
              <option value="">Select Business Type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {formErrors['businessDetails.businessType'] && (
              <p className="mt-1 text-sm text-destructive">{formErrors['businessDetails.businessType']}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="businessDetails.website" className="block text-sm font-medium mb-1">
              Website (Optional)
            </label>
            <input
              id="businessDetails.website"
              name="businessDetails.website"
              type="url"
              className="w-full px-4 py-2 border border-border rounded-full focus:ring-2 focus:ring-primary focus:outline-none"
              value={data.businessDetails.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <label htmlFor="businessDetails.establishedYear" className="block text-sm font-medium mb-1">
              Year Established
            </label>
            <input
              id="businessDetails.establishedYear"
              name="businessDetails.establishedYear"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-4 py-2 border border-border rounded-full focus:ring-2 focus:ring-primary focus:outline-none"
              value={data.businessDetails.establishedYear}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="businessDetails.description" className="block text-sm font-medium mb-1">
            Business Description
          </label>
          <textarea
            id="businessDetails.description"
            name="businessDetails.description"
            rows={3}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            value={data.businessDetails.description}
            onChange={handleInputChange}
            placeholder="Tell us about your business and the materials you supply..."
          />
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-3">Business Address</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="address.street" className="block text-sm font-medium mb-1">
              Street Address
            </label>
            <input
              id="address.street"
              name="address.street"
              type="text"
              className="w-full px-4 py-2 border border-border rounded-full focus:ring-2 focus:ring-primary focus:outline-none"
              value={data.address.street}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="address.city" className="block text-sm font-medium mb-1">
              City
            </label>
            <input
              id="address.city"
              name="address.city"
              type="text"
              className="w-full px-4 py-2 border border-border rounded-full focus:ring-2 focus:ring-primary focus:outline-none"
              value={data.address.city}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="address.country" className="block text-sm font-medium mb-1">
              Country
            </label>
            <input
              id="address.country"
              name="address.country"
              type="text"
              className="w-full px-4 py-2 border border-border rounded-full focus:ring-2 focus:ring-primary focus:outline-none"
              value={data.address.country}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="address.postalCode" className="block text-sm font-medium mb-1">
              Postal/Zip Code
            </label>
            <input
              id="address.postalCode"
              name="address.postalCode"
              type="text"
              className="w-full px-4 py-2 border border-border rounded-full focus:ring-2 focus:ring-primary focus:outline-none"
              value={data.address.postalCode}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      
      <div className="rounded-md bg-secondary/20 p-4 mt-4">
        <p className="text-sm text-muted-foreground">
          As a Supplier, you'll be able to showcase your products, receive quote requests, 
          and connect with project owners. Your account will be reviewed by our team before activation.
        </p>
      </div>
    </div>
  );
}
