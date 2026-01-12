"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {
  FileText,
  Upload,
  User,
  LogOut,
  Home,
  PenTool,
  Clock,
  CheckCircle,
  Menu,
  X,
  Package,
  Mail,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [applicationStats, setApplicationStats] = useState({
    inProgress: 0,
    completed: 0
  });
  const [activePackage, setActivePackage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  // Fetch application stats
  useEffect(() => {
    const fetchApplicationStats = async () => {
      if (session) {
        try {
          // Fetch all applications (not just drafts)
          const response = await fetch('/api/applications/submit');
          if (response.ok) {
            const applications = await response.json();

            // Count applications by status
            const stats = applications.reduce((acc: any, app: any) => {
              if (app.status === 'DRAFT' || app.status === 'IN_REVIEW' || app.status === 'SUBMITTED') {
                acc.inProgress++;
              } else if (app.status === 'COMPLETED' || app.status === 'REVIEWED') {
                acc.completed++;
              }
              return acc;
            }, { inProgress: 0, completed: 0 });

            setApplicationStats(stats);

            // Get the most recent application's package type
            if (applications.length > 0) {
              const latestApp = applications[0];
              const packageMap: { [key: string]: string } = {
                'COMPREHENSIVE': 'Comprehensive',
                'PREMIUM': 'Premium',
                'COMPLETE': 'Complete'
              };
              setActivePackage(packageMap[latestApp.packageType] || latestApp.packageType);
            }
          }
        } catch (error) {
          console.error('Error fetching application stats:', error);
        }
      }
    };

    fetchApplicationStats();
  }, [session, pathname]); // Refresh when pathname changes

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Applications", href: "/dashboard/applications", icon: FileText },
    { name: "New Application", href: "/dashboard/new", icon: Upload },
    { name: "Reviews", href: "/dashboard/reviews", icon: PenTool },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              
              <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 ml-2 lg:ml-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 relative flex items-center justify-center">
                  <Image 
                    src="/logo2.png" 
                    alt="MyERAS Reviewer Logo" 
                    width={32}
                    height={32}
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-lg sm:text-xl font-bold text-black hidden sm:block">MyERAS Reviewer</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-black font-medium hidden sm:block">
                Welcome, {session.user?.name || session.user?.email}
              </span>
              <span className="text-xs sm:text-sm text-black font-medium sm:hidden">
                {session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0]}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs sm:text-sm"
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
        <div className="hidden lg:block w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)]">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActiveRoute(item.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-black hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Package Info - Desktop */}
          {activePackage && (
            <div className="mt-6 mx-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-black">Active Package</h3>
              </div>
              <p className="text-sm font-bold text-blue-900">{activePackage}</p>
            </div>
          )}

          {/* Stats - Desktop */}
          <div className="mt-6 mx-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-black mb-3">Application Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-xs text-black">In Progress</span>
                </div>
                <span className="text-xs font-semibold text-black">{applicationStats.inProgress}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-xs text-black">Completed</span>
                </div>
                <span className="text-xs font-semibold text-black">{applicationStats.completed}</span>
              </div>
            </div>
          </div>

          {/* Contact Us Section - Desktop */}
          <div className="mt-6 mx-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-black">Need Help?</h3>
            </div>
            <p className="text-xs text-gray-600 mb-2">Contact our support team</p>
            <a
              href="mailto:team@myerasediting.com"
              className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              <Mail className="h-3 w-3" />
              team@myerasediting.com
            </a>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
            
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
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
                  <Image 
                    src="/logo2.png" 
                    alt="MyERAS Reviewer Logo" 
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                  <span className="ml-3 text-xl font-bold text-black">MyERAS</span>
                </div>
                
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group flex items-center px-2 py-3 text-base font-medium rounded-md ${
                        isActiveRoute(item.href)
                          ? "bg-blue-50 text-blue-600"
                          : "text-black hover:bg-gray-50 hover:text-blue-600"
                      }`}
                    >
                      <item.icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Package Info - Mobile */}
                {activePackage && (
                  <div className="mt-6 mx-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <h3 className="text-sm font-semibold text-black">Active Package</h3>
                    </div>
                    <p className="text-sm font-bold text-blue-900">{activePackage}</p>
                  </div>
                )}

                {/* Stats - Mobile */}
                <div className="mt-6 mx-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-black mb-3">Application Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                        <span className="text-xs text-black">In Progress</span>
                      </div>
                      <span className="text-xs font-semibold text-black">{applicationStats.inProgress}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-xs text-black">Completed</span>
                      </div>
                      <span className="text-xs font-semibold text-black">{applicationStats.completed}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Us Section - Mobile */}
                <div className="mt-6 mx-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-gray-600" />
                    <h3 className="text-sm font-semibold text-black">Need Help?</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Contact our support team</p>
                  <a
                    href="mailto:team@myerasediting.com"
                    className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Mail className="h-3 w-3" />
                    team@myerasediting.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}