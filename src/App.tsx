/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { EpgViewer } from './components/EpgViewer';
import { BookmarkletGenerator } from './components/BookmarkletGenerator';
import { ColorCustomizer } from './components/ColorCustomizer';
import { UsageGuide } from './components/UsageGuide';
import { ProgramDetailModal } from './components/ProgramDetailModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { ShareModal } from './components/ShareModal';
import { UserColorConfig } from './utils/bookmarkletGenerator';
import { COLOR_SCHEMES } from './data/genres';
import { Program, Channel } from './types/epg';

const STORAGE_KEY_CONFIG = 'tv_epg_color_config_v1';
const STORAGE_KEY_FAVORITES = 'tv_epg_favorites_v1';

const DEFAULT_CONFIG: UserColorConfig = {
  colors: { ...COLOR_SCHEMES[0].colors },
  opacity: 1.0,
  borderWidth: 4,
  showBadge: true,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('epg');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [colorConfig, setColorConfig] = useState<UserColorConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_CONFIG;
  });

  const [favorites, setFavorites] = useState<Program[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return [];
  });

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [customPrograms, setCustomPrograms] = useState<Program[]>([]);

  const handleAddCustomPrograms = (newPrograms: Program[]) => {
    setCustomPrograms((prev) => [...prev, ...newPrograms]);
  };

  // Persist color config
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(colorConfig));
    } catch (e) {
      // ignore
    }
  }, [colorConfig]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      // ignore
    }
  }, [favorites]);

  const handleSelectProgram = (program: Program, channel: Channel) => {
    setSelectedProgram(program);
    setSelectedChannel(channel);
  };

  const handleToggleFavorite = (program: Program) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === program.id);
      if (exists) {
        return prev.filter((p) => p.id !== program.id);
      } else {
        return [...prev, program];
      }
    });
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearFavorites = () => {
    setFavorites([]);
  };

  const handleResetToDefault = () => {
    setColorConfig({
      colors: { ...COLOR_SCHEMES[0].colors },
      opacity: 1.0,
      borderWidth: 4,
      showBadge: true,
    });
  };

  return (
    <div
      className={`bg-slate-100 flex flex-col font-sans ${
        activeTab === 'epg' ? 'h-dvh max-h-dvh overflow-hidden' : 'min-h-screen'
      }`}
    >
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      <main
        className={`flex-1 ${
          activeTab === 'epg' ? 'min-h-0 flex flex-col overflow-hidden' : 'overflow-y-auto'
        }`}
      >
        {activeTab === 'epg' && (
          <EpgViewer
            colorConfig={colorConfig}
            onSelectProgram={handleSelectProgram}
            onNavigateToTools={() => setActiveTab('tools')}
            customPrograms={customPrograms}
            onAddCustomPrograms={handleAddCustomPrograms}
          />
        )}

        {activeTab === 'tools' && (
          <BookmarkletGenerator
            colorConfig={colorConfig}
            onNavigateToCustomizer={() => setActiveTab('customizer')}
          />
        )}

        {activeTab === 'customizer' && (
          <ColorCustomizer
            colorConfig={colorConfig}
            onUpdateConfig={setColorConfig}
            onResetToDefault={handleResetToDefault}
            onNavigateToEpg={() => setActiveTab('epg')}
          />
        )}

        {activeTab === 'guide' && (
          <UsageGuide onNavigateToTools={() => setActiveTab('tools')} />
        )}
      </main>

      {/* Program Detail Modal */}
      {selectedProgram && selectedChannel && (
        <ProgramDetailModal
          program={selectedProgram}
          channel={selectedChannel}
          isFavorite={favorites.some((p) => p.id === selectedProgram.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => {
            setSelectedProgram(null);
            setSelectedChannel(null);
          }}
          colorConfig={colorConfig}
        />
      )}

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
        onClearAll={handleClearFavorites}
      />

      {/* Direct Link / Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
