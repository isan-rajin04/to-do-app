"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                DoIt!
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {status === "authenticated" ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center text-gray-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                  <span className="text-sm font-semibold text-indigo-900">
                    SELAMAT DATANG, {session.user?.name || session.user?.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-slate-500 bg-white hover:text-rose-600 hover:bg-rose-50 focus:outline-none transition-colors shadow-sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </motion.div>
            ) : status === "unauthenticated" ? (
              <div className="space-x-4">
                <Link href="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Register
                </Link>
              </div>
            ) : (
              <div className="w-32 h-8 bg-gray-200 animate-pulse rounded-full"></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
