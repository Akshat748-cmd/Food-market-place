'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { MascotFace } from '@/components/illustrations/MascotFace';
import { AIChatEngine } from '@/components/assistant/AIChatEngine';
import { X, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useScrollLock } from '@/hooks/useScrollLock';

export function AppShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Lock background scroll when assistant modal is open on mobile
  useScrollLock(isAssistantOpen);

  // If user is on onboarding or landing, omit the app shell
  const isPlainPage =
    pathname === '/' ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/styleguide');

  if (isPlainPage) {
    return <>{children}</>;
  }

  const isAssistantRoute = pathname === '/app/assistant';

  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#263D2D]">
      {/* Desktop Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area - Full bleed, single window scroll, margin-left 264px on lg */}
      <div className="lg:ml-[264px] min-h-screen flex flex-col">
        <TopBar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full pb-[112px] pt-4 sm:pt-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Floating 56px Round Mascot Button (Desktop bottom-right 24px; Mobile bottom-left above bar) */}
      {!isAssistantRoute && (
        <div className="fixed bottom-20 left-4 lg:bottom-6 lg:left-auto lg:right-6 z-40">
          <button
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className="group relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#263D2D] hover:bg-[#315B42] text-white shadow-warm-xl border-2 border-[#F8C45C] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Open Chef Hub AI Kitchen Copilot"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FFF9EF] flex items-center justify-center overflow-hidden border border-[#F8C45C]/60">
              <MascotFace emotion="winking" size={36} />
            </div>

            {/* Desktop Tooltip: Small "Ask AI" pill on hover instead of wide pill */}
            <span className="hidden lg:block absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#263D2D] text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md border border-[#F8C45C]/40">
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
              <div className="p-3 bg-[#FFF9EF]/40 flex-1 overflow-y-auto">
                <AIChatEngine />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
