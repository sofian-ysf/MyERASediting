"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {
  Users,
  FileText,
  Home,
  LogOut,
  Menu,
  X,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    applicationsInReview: 0,
    completedReviews: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    } else {
      // Check if user is admin
      fetch('/api/admin/check')
        .then(res => {
          if (!res.ok) {
            router.push("/dashboard");
          } else {
            setIsAdmin(true);
          }
        })
        .catch(() => router.push("/dashboard"));
    }
  }, [session, status, router]);

  // Fetch admin stats
  useEffect(() => {
    if (isAdmin) {
      const fetchStats = async () => {
        try {
          const response = await fetch('/api/admin/stats');
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          }
        } catch (error) {
          console.error('Error fetching admin stats:', error);
        }
      };

      fetchStats();
    }
  }, [isAdmin, pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (status === "loading" || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Applications", href: "/admin/applications", icon: FileText },
    { name: "Blog", href: "/admin/blog", icon: BookOpen },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Admin Header */}
      <nav className="bg-gray-800 shadow-lg border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              <Link href="/admin" className="flex items-center gap-2 sm:gap-3 ml-2 lg:ml-0">
                <Shield className="h-8 w-8 text-blue-500" />
                <span className="text-lg sm:text-xl font-bold text-white">Admin Dashboard</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-300 font-medium hidden sm:block">
                Admin: {session.user?.name || session.user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-gray-800 shadow-sm min-h-[calc(100vh-4rem)]">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActiveRoute(item.href)
                      ? "bg-gray-900 text-blue-400"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Admin Stats */}
          <div className="mt-6 mx-4 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-xs text-gray-300">Total Users</span>
                </div>
                <span className="text-xs font-semibold text-white">{stats.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-yellow-400 mr-2" />
                  <span className="text-xs text-gray-300">In Review</span>
                </div>
                <span className="text-xs font-semibold text-white">{stats.applicationsInReview}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-xs text-gray-300">Completed</span>
                </div>
                <span className="text-xs font-semibold text-white">{stats.completedReviews}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-orange-400 mr-2" />
                  <span className="text-xs text-gray-300">Edit Requests</span>
                </div>
                <span className="text-xs font-semibold text-white">{stats.pendingRequests}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />

            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <Shield className="h-8 w-8 text-blue-500" />
                  <span className="ml-3 text-xl font-bold text-white">Admin</span>
                </div>

                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group flex items-center px-2 py-3 text-base font-medium rounded-md ${
                        isActiveRoute(item.href)
                          ? "bg-gray-900 text-blue-400"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <item.icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Stats */}
                <div className="mt-6 mx-4 p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-sm font-semibold text-white mb-3">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-blue-400 mr-2" />
                        <span className="text-xs text-gray-300">Total Users</span>
                      </div>
                      <span className="text-xs font-semibold text-white">{stats.totalUsers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-yellow-400 mr-2" />
                        <span className="text-xs text-gray-300">In Review</span>
                      </div>
                      <span className="text-xs font-semibold text-white">{stats.applicationsInReview}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-xs text-gray-300">Completed</span>
                      </div>
                      <span className="text-xs font-semibold text-white">{stats.completedReviews}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}