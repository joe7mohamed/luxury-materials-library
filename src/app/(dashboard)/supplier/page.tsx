// app/(dashboard)/supplier/page.tsx
import React from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Package, ShoppingBag, TrendingUp, MessageSquare } from "lucide-react";
import Link from "next/link";

export default async function SupplierDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.userType !== "supplier") {
    redirect("/login");
  }

  // This would normally fetch data from an API endpoint
  const stats = {
    totalProducts: 28,
    pendingApproval: 3,
    totalViews: 982,
    quoteRequests: 14,
  };

  const recentQuotes = [
    {
      id: 1,
      product: "Modern Aluminum Door",
      client: "Arabian Design Studio",
      date: "2023-04-15",
      status: "pending",
    },
    {
      id: 2,
      product: "Frameless Glass Partition",
      client: "Bahrain Interior Solutions",
      date: "2023-04-12",
      status: "responded",
    },
    {
      id: 3,
      product: "Custom Entrance Door",
      client: "Royal Palaces Ltd",
      date: "2023-04-10",
      status: "closed",
    },
  ];

  const topProducts = [
    {
      id: 1,
      name: "Premium Wood Door",
      category: "Doors & Glass",
      views: 245,
      quotes: 8,
    },
    {
      id: 2,
      name: "Sliding Glass System",
      category: "Doors & Glass",
      views: 198,
      quotes: 5,
    },
    {
      id: 3,
      name: "Aluminum Entrance Gate",
      category: "Doors & Glass",
      views: 176,
      quotes: 3,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">
            Manage your products and quote requests
          </p>
        </div>
        <Link
          href="/supplier/products/add"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm"
        >
          Add New Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div className="mt-4 text-sm">
            <span className="text-muted-foreground">Pending Approval: </span>
            <span className="font-medium text-amber-500">
              {stats.pendingApproval}
            </span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm">Total Views</p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalViews}</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <TrendingUp size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-muted-foreground">Last 30 days: </span>
            <span className="font-medium text-green-500">+124</span>
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
          <div className="mt-4 text-sm">
            <span className="text-muted-foreground">New: </span>
            <span className="font-medium text-destructive">4</span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm">Messages</p>
              <h3 className="text-3xl font-bold mt-2">8</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <MessageSquare size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-muted-foreground">Unread: </span>
            <span className="font-medium text-blue-500">2</span>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quote Requests */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Quote Requests</h2>
            <Link
              href="/supplier/quotes"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-sm text-muted-foreground">
                  <th className="text-left py-2 px-1 font-medium">Product</th>
                  <th className="text-left py-2 px-1 font-medium">Client</th>
                  <th className="text-left py-2 px-1 font-medium">Date</th>
                  <th className="text-left py-2 px-1 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentQuotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-3 px-1">
                      <div className="font-medium truncate max-w-[150px]">
                        {quote.product}
                      </div>
                    </td>
                    <td className="py-3 px-1 text-sm">{quote.client}</td>
                    <td className="py-3 px-1 text-sm text-muted-foreground">
                      {new Date(quote.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-1">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          quote.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : quote.status === "responded"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {quote.status === "pending"
                          ? "Pending"
                          : quote.status === "responded"
                          ? "Responded"
                          : "Closed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Top Products</h2>
            <Link
              href="/supplier/products"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Views: </span>
                    <span className="font-medium">{product.views}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quotes: </span>
                    <span className="font-medium">{product.quotes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
