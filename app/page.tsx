'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AudioPlayer } from '@/components/layout/AudioPlayer';
import { Footer } from '@/components/layout/Footer';

import { ProfileHeader } from '@/components/features/ProfileHeader';
import { HighlightsGrid } from '@/components/features/HighlightsGrid';
import { NewsSection } from '@/components/features/NewsSection';
import { FeaturedServers } from '@/components/features/FeaturedServers';
import { GallerySection } from '@/components/features/GallerySection';
import { CommunityUsers } from '@/components/features/CommunityUsers';
import { RankingsCard } from '@/components/features/RankingsCard';
import { EmblemsCard } from '@/components/features/EmblemsCard';
import { AchievementsCard } from '@/components/features/AchievementsCard';
import { LatestEvents } from '@/components/features/LatestEvents';
import { StoreCard } from '@/components/features/StoreCard';
import { RecentPosts } from '@/components/features/RecentPosts';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex font-sans pb-28 relative">
      {/* Sidebar retrátil */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Conteúdo Principal (Acompanha a sidebar corretamente) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-[margin] duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        <main className="p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">
          {/* Perfil & Banner */}
          <ProfileHeader />

          {/* Destaques */}
          <HighlightsGrid />

          {/* Grid Principal: Novidades & Servidores */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <NewsSection />
              <GallerySection />
            </div>
            <div className="space-y-8">
              <FeaturedServers />
              <CommunityUsers />
            </div>
          </div>

          {/* Grid Inferior: Rankings, Emblemas, Conquistas, Eventos e Loja */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RankingsCard />
            <div className="space-y-6">
              <EmblemsCard />
              <AchievementsCard />
            </div>
            <div className="space-y-6">
              <LatestEvents />
              <StoreCard />
            </div>
          </div>

          {/* Posts Recentes */}
          <RecentPosts />
        </main>

        {/* Rodapé colocado dentro da coluna principal, logo abaixo do conteúdo */}
        <Footer />
      </div>

      {/* Player Inferior fixo por cima de toda a página */}
      <AudioPlayer />
    </div>
  );
}