// app/(dashboard)/project-owner/page.tsx
import React from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Heart, MessageSquare, Building, Clock } from "lucide-react";

export default async function ProjectOwnerDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.userType !== "projectOwner") {
    redirect("/login");
  }

  // This would normally fetch data from an API endpoint
  const stats = {
    favorites: 24,
    quoteRequests: 8,
    recentlyViewed: 36,
  };

  const recentActivity = [
    {
      id: 1,
      type: "favorite",
      product: "Premium Marble Flooring",
      supplier: "Delmon Ceramic",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "quote",
      product: "Custom Steel Door",
      supplier: "Rida Doors",
      time: "1 day ago",
    },
    {
      id: 3,
      type: "view",
      product: "Luxury Bathroom Fixtures",
      supplier: "Aqua Art",
      time: "2 days ago",
    },
  ];

  const featuredSuppliers = [
    {
      id: 1,
      name: "Paramount Doors",
      category: "Doors & Glass",
      products: 48,
      logo: "/placeholder-logo.jpg",
    },
    {
      id: 2,
      name: "Aqua Art",
      category: "Sanitary Ware",
      products: 64,
      logo: "/placeholder-logo.jpg",
    },
    {
      id: 3,
      name: "Zahra Artist",
      category: "Accessories & Art",
      products: 32,
      logo: "/placeholder-logo.jpg",
    },
  ];

  const pendingQuotes = [
    {
      id: 1,
      product: "Premium Wooden Door",
      supplier: "Global Doors",
      requestDate: "2023-04-12",
      status: "pending",
    },
    {
      id: 2,
      product: "Modern Bathroom Set",
      supplier: "Haji Gallery",
      requestDate: "2023-04-10",
      status: "responded",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground">
          Discover premium materials for your projects
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">My Favorites</p>
              <h3 className="text-3xl font-bold mt-2">{stats.favorites}</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Heart size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/project-owner/favorites"
              className="text-sm text-primary hover:underline"
            >
              View All Favorites
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Quote Requests</p>
              <h3 className="text-3xl font-bold mt-2">{stats.quoteRequests}</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <MessageSquare size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/project-owner/quotes"
              className="text-sm text-primary hover:underline"
            >
              View All Requests
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Recently Viewed</p>
              <h3 className="text-3xl font-bold mt-2">
                {stats.recentlyViewed}
              </h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Clock size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/materials"
              className="text-sm text-primary hover:underline"
            >
              Browse Materials
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
              >
                <div className="mt-1">
                  {activity.type === "favorite" && (
                    <Heart size={18} className="text-red-500" />
                  )}
                  {activity.type === "quote" && (
                    <MessageSquare size={18} className="text-blue-500" />
                  )}
                  {activity.type === "view" && (
                    <Package size={18} className="text-amber-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    {activity.type === "favorite" && (
                      <>
                        You added{" "}
                        <span className="font-medium">{activity.product}</span>{" "}
                        to favorites
                      </>
                    )}
                    {activity.type === "quote" && (
                      <>
                        You requested a quote for{" "}
                        <span className="font-medium">{activity.product}</span>
                      </>
                    )}
                    {activity.type === "view" && (
                      <>
                        You viewed{" "}
                        <span className="font-medium">{activity.product}</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    From {activity.supplier} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Quote Requests */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pending Quote Requests</h2>
            <Link
              href="/project-owner/quotes"
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          {pendingQuotes.length > 0 ? (
            <div className="space-y-4">
              {pendingQuotes.map((quote) => (
                <div
                  key={quote.id}
                  className="p-3 border border-border rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{quote.product}</p>
                      <p className="text-sm text-muted-foreground">
                        Supplier: {quote.supplier}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        quote.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {quote.status === "pending" ? "Pending" : "Responded"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-sm">
                    <span className="text-muted-foreground">
                      Requested:{" "}
                      {new Date(quote.requestDate).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/project-owner/quotes/${quote.id}`}
                      className="text-primary hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No pending quote requests</p>
              <Link
                href="/materials"
                className="mt-2 inline-block text-primary hover:underline"
              >
                Browse Materials
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Featured Suppliers */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Featured Suppliers</h2>
          <Link
            href="/suppliers"
            className="text-sm text-primary hover:underline"
          >
            View All Suppliers
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="p-4 border border-border rounded-lg flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center">
                <Building size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">{supplier.name}</p>
                <p className="text-sm text-muted-foreground">
                  {supplier.category}
                </p>
                <p className="text-sm mt-1">
                  <span className="text-primary font-medium">
                    {supplier.products}
                  </span>{" "}
                  products
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
