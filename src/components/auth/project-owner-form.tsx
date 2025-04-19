// components/auth/project-owner-form.tsx
import React from 'react';

interface ProjectOwnerFormProps {
  data: {
    company: string;
    phone: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string>;
}

export default function ProjectOwnerForm({ 
  data, 
  onChange,
  errors = {}
}: ProjectOwnerFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Project Owner Information</h3>
      
      <div>
        <label htmlFor="company" className="block text-sm font-medium mb-1">
          Company (Optional)
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-primary focus:outline-none ${
            errors.company ? 'border-destructive' : 'border-border'
          }`}
          value={data.company}
          onChange={onChange}
        />
        {errors.company && (
          <p className="mt-1 text-sm text-destructive">{errors.company}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className={`w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-primary focus:outline-none ${
            errors.phone ? 'border-destructive' : 'border-border'
          }`}
          value={data.phone}
          onChange={onChange}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
        )}
      </div>
      
      <div className="rounded-md bg-secondary/20 p-4 mt-4">
        <p className="text-sm text-muted-foreground">
          As a Project Owner, you'll be able to browse all materials, save favorites, 
          request quotes from suppliers, and manage your projects.
        </p>
      </div>
    </div>
  );
}