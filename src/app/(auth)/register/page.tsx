// app/(auth)/register/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';
import ProjectOwnerForm from '@/components/auth/project-owner-form';
import SupplierForm from '@/components/auth/supplier-form';

export default function RegisterPage() {
  const { register, error, clearError } = useAuth();
  const router = useRouter();
  const [userType, setUserType] = useState<'projectOwner' | 'supplier'>('projectOwner');
  const [step, setStep] = useState(1);
  const [commonData, setCommonData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [projectOwnerData, setProjectOwnerData] = useState({
    company: '',
    phone: ''
  });
  const [supplierData, setSupplierData] = useState({
    company: '',
    phone: '',
    address: {
      street: '',
      city: '',
      country: '',
      postalCode: ''
    },
    businessDetails: {
      businessType: '',
      description: '',
      website: '',
      establishedYear: new Date().getFullYear()
    }
  });
  const [commonErrors, setCommonErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUserTypeChange = (type: 'projectOwner' | 'supplier') => {
    setUserType(type);
    if (error) clearError();
  };

  const validateCommonData = () => {
    const errors: Record<string, string> = {};
    
    if (!commonData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(commonData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!commonData.password) {
      errors.password = 'Password is required';
    } else if (commonData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (commonData.password !== commonData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!commonData.name) {
      errors.name = 'Name is required';
    }
    
    setCommonErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCommonDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCommonData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field error when typing
    if (commonErrors[name]) {
      setCommonErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear global error on form change
    if (error) {
      clearError();
    }
  };

  const handleContinue = () => {
    if (validateCommonData()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleProjectOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjectOwnerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSupplierChange = (data: any) => {
    setSupplierData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      const userData = {
        ...commonData,
        userType,
        ...(userType === 'projectOwner' ? projectOwnerData : supplierData)
      };
      
      // Remove confirmPassword as it's not needed for registration
      const { confirmPassword, ...registrationData } = userData;
      
      const result = await register(registrationData);
      
      if (userType === 'projectOwner') {
        // Navigate to login page with success message for immediate login
        router.push('/login?registered=true');
      } else {
        // Navigate to pending approval page
        router.push('/register/pending');
      }
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary/90">
              Sign in
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="bg-secondary/20 p-4 rounded-lg mb-6">
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => handleUserTypeChange('projectOwner')}
              className={`px-6 py-3 rounded-full ${
                userType === 'projectOwner'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 hover:bg-secondary/80'
              }`}
            >
              Project Owner
            </button>
            <button
              type="button"
              onClick={() => handleUserTypeChange('supplier')}
              className={`px-6 py-3 rounded-full ${
                userType === 'supplier'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 hover:bg-secondary/80'
              }`}
            >
              Supplier
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Account Information</h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-primary focus:outline-none ${
                    commonErrors.name ? 'border-destructive' : 'border-border'
                  }`}
                  value={commonData.name}
                  onChange={handleCommonDataChange}
                />
                {commonErrors.name && (
                  <p className="mt-1 text-sm text-destructive">{commonErrors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-primary focus:outline-none ${
                    commonErrors.email ? 'border-destructive' : 'border-border'
                  }`}
                  value={commonData.email}
                  onChange={handleCommonDataChange}
                />
                {commonErrors.email && (
                  <p className="mt-1 text-sm text-destructive">{commonErrors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-primary focus:outline-none ${
                    commonErrors.password ? 'border-destructive' : 'border-border'
                  }`}
                  value={commonData.password}
                  onChange={handleCommonDataChange}
                />
                {commonErrors.password && (
                  <p className="mt-1 text-sm text-destructive">{commonErrors.password}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-primary focus:outline-none ${
                    commonErrors.confirmPassword ? 'border-destructive' : 'border-border'
                  }`}
                  value={commonData.confirmPassword}
                  onChange={handleCommonDataChange}
                />
                {commonErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-destructive">{commonErrors.confirmPassword}</p>
                )}
              </div>
              
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div>
              {userType === 'projectOwner' ? (
                <ProjectOwnerForm 
                  data={projectOwnerData} 
                  onChange={handleProjectOwnerChange} 
                />
              ) : (
                <SupplierForm 
                  data={supplierData} 
                  onChange={handleSupplierChange} 
                />
              )}
              
              <div className="flex space-x-4 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 border border-border rounded-full shadow-sm text-sm font-medium hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Registering...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}