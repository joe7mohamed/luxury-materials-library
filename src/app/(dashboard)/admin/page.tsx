// app/(dashboard)/admin/page.tsx
import React from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import {
  Users,
  Package,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.userType !== "admin") {
    redirect("/login");
  }

  // This would normally fetch data from an API endpoint
  const stats = {
    totalUsers: 458,
    activeSuppliers: 158,
    pendingSuppliers: 14,
    totalProducts: 3256,
    pendingProducts: 87,
    quoteRequests: 245,
  };

  const recentActivities = [
    {
      id: 1,
      type: "supplier_approval",
      name: "RIDA DOORS",
      time: "10 minutes ago",
    },
    {
      id: 2,
      type: "product_approval",
      name: "Premium Oak Door with Glass Insert",
      supplier: "PARAMOUNT DOORS",
      time: "2 hours ago",
    },
    {
      id: 3,
      type: "new_supplier",
      name: "EPHURIA DECOR",
      time: "5 hours ago",
    },
    {
      id: 4,
      type: "product_rejection",
      name: "Modern Bathroom Faucet",
      supplier: "AQUA ART",
      time: "1 day ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm">Total Users</p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalUsers}</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Users size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm">
            <div>
              <span className="text-muted-foreground">Active Suppliers: </span>
              <span className="font-medium">{stats.activeSuppliers}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Pending: </span>
              <span className="font-medium text-destructive">
                {stats.pendingSuppliers}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm">Total Products</p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalProducts}</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Package size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm">
            <div>
              <span className="text-muted-foreground">Active: </span>
              <span className="font-medium">
                {stats.totalProducts - stats.pendingProducts}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Pending Approval: </span>
              <span className="font-medium text-destructive">
                {stats.pendingProducts}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm">Quote Requests</p>
              <h3 className="text-3xl font-bold mt-2">{stats.quoteRequests}</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <ShoppingBag size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm">
            <div>
              <span className="text-muted-foreground">This Week: </span>
              <span className="font-medium">78</span>
            </div>
            <div>
              <span className="text-primary-foreground px-2 py-1 bg-primary text-xs rounded-full">
                +12% ↑
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-destructive" />
                <div>
                  <p className="font-medium">New Suppliers</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingSuppliers} suppliers waiting for approval
                  </p>
                </div>
              </div>
              <a
                href="/admin/users?filter=pending"
                className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full"
              >
                Review
              </a>
            </div>

            <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-destructive" />
                <div>
                  <p className="font-medium">New Products</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingProducts} products waiting for approval
                  </p>
                </div>
              </div>
              <a
                href="/admin/products?filter=pending"
                className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full"
              >
                Review
              </a>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
              >
                <div className="mt-1">
                  {activity.type === "supplier_approval" && (
                    <CheckCircle2 size={18} className="text-green-500" />
                  )}
                  {activity.type === "product_approval" && (
                    <CheckCircle2 size={18} className="text-blue-500" />
                  )}
                  {activity.type === "new_supplier" && (
                    <Clock size={18} className="text-amber-500" />
                  )}
                  {activity.type === "product_rejection" && (
                    <AlertCircle size={18} className="text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    {activity.type === "supplier_approval" && (
                      <>
                        Approved supplier{" "}
                        <span className="font-medium">{activity.name}</span>
                      </>
                    )}
                    {activity.type === "product_approval" && (
                      <>
                        Approved product{" "}
                        <span className="font-medium">{activity.name}</span>{" "}
                        from{" "}
                        <span className="font-medium">{activity.supplier}</span>
                      </>
                    )}
                    {activity.type === "new_supplier" && (
                      <>
                        New supplier registered:{" "}
                        <span className="font-medium">{activity.name}</span>
                      </>
                    )}
                    {activity.type === "product_rejection" && (
                      <>
                        Rejected product{" "}
                        <span className="font-medium">{activity.name}</span>{" "}
                        from{" "}
                        <span className="font-medium">{activity.supplier}</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
