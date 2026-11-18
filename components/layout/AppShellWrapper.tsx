'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { MascotFace } from '@/components/illustrations/MascotFace';
import { AIChatEngine } from '@/components/assistant/AIChatEngine';
import { X, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useAppStore } from '@/store/useAppStore';
import { useHydrated } from '@/lib/useHydration';

export function AppShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHydrated = useHydrated();
  const { isAuthenticated } = useAppStore();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Lock background scroll when assistant modal is open on mobile
  useScrollLock(isAssistantOpen);

  // If user is on onboarding, landing, or login, omit the app shell
  const isPlainPage =
    pathname === '/' ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/app/onboarding') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/app/register') ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/styleguide') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/app/login');

  useEffect(() => {
    if (isHydrated && !isAuthenticated && !isPlainPage) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, isPlainPage, router]);

  if (isPlainPage) {
    return <>{children}</>;
  }

  const isAssistantRoute = pathname === '/app/assistant';

  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#263D2D]">
      {/* Desktop Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area - Full bleed, single window scroll, margin-left 216px on lg */}
      <div className="lg:ml-[216px] min-h-screen flex flex-col">
        <TopBar />
        <main className="flex-1 px-3 sm:px-5 lg:px-7 max-w-[1240px] mx-auto w-full pb-16 pt-3 sm:pt-4">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Floating Compact Round Mascot Button */}
      {!isAssistantRoute && (
        <div className="fixed bottom-18 left-4 lg:bottom-5 lg:left-auto lg:right-5 z-40">
          <button
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#263D2D] hover:bg-[#315B42] text-white shadow-warm-lg border border-[#F8C45C] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Open Chef Hub AI Kitchen Copilot"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFF9EF] flex items-center justify-center overflow-hidden border border-[#F8C45C]/60">
              <MascotFace emotion="winking" size={28} />
            </div>

            {/* Desktop Tooltip: Small "Ask AI" pill on hover */}
            <span className="hidden lg:block absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#263D2D] text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md border border-[#F8C45C]/40">
              Ask AI
            </span>
          </button>
        </div>
      )}

      {/* Floating Assistant Modal / Bottom Sheet */}
      <AnimatePresence>
        {isAssistantOpen && !isAssistantRoute && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssistantOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 md:hidden backdrop-blur-sm"
            />

            {/* Container: Bottom sheet on mobile, floating card on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-2 bottom-2 z-50 md:inset-x-auto md:right-6 md:bottom-22 md:w-[480px] bg-white rounded-3xl shadow-2xl border border-[#263D2D]/15 overflow-hidden flex flex-col max-h-[85vh] md:max-h-[640px]"
            >
              {/* Header */}
              <div className="bg-[#263D2D] text-white p-3.5 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FFF9EF] flex items-center justify-center border border-[#F8C45C]">
                    <MascotFace emotion="happy" size={26} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      Chef Hub AI Copilot
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-[10px] text-white/70">Ready to compare mandis & ingredients</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsAssistantOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="p-2 sm:p-3 bg-[#FFF9EF]/40 flex-1 overflow-y-auto">
                <AIChatEngine isModal={true} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
