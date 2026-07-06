"use client";

import { useState } from "react";
import { useStudyStore, AmbientSound } from "@/store/use-study-store";
import {
  Flame,
  Volume2,
  VolumeX,
  EyeOff,
  Eye,
  Music,
  User,
  Coffee,
  Brain,
  Wind,
  Moon,
  Sun,
  Menu,
} from "lucide-react";

interface HeaderProps {
  title: string;
  onMobileMenuToggle?: () => void;
}

export function Header({ title, onMobileMenuToggle }: HeaderProps) {
  const {
    monkModeEnabled,
    toggleMonkMode,
    currentStreak,
    level,
    xp,
    ambientSound,
    setAmbientSound,
    volume,
    setVolume,
  } = useStudyStore();

  const [soundMenuOpen, setSoundMenuOpen] = useState(false);

  const sounds: Array<{ id: AmbientSound; name: string; icon: React.ReactNode }> = [
    { id: "none", name: "Silence", icon: <VolumeX className="w-4 h-4" /> },
    { id: "rain", name: "Rainfall", icon: <Wind className="w-4 h-4" /> },
    { id: "white-noise", name: "White Noise", icon: <Coffee className="w-4 h-4" /> },
    { id: "lofi", name: "Focus Drone", icon: <Brain className="w-4 h-4" /> },
  ];

  const activeSound = sounds.find(
    (s) => s.id === ambientSound
  );

  return (
    <header className="flex items-center justify-between h-14 md:h-16 px-3 md:px-6 border-b border-card-border bg-[#0d0f12]/50 backdrop-blur-md relative z-40 gap-2">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        {/* Mobile hamburger menu button */}
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <h1 className="text-sm md:text-lg font-semibold text-white tracking-wide truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-6 shrink-0">
        {/* Ambient Audio Panel */}
        <div className="relative">
          <button
            onClick={() => setSoundMenuOpen(!soundMenuOpen)}
            className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 rounded-lg border border-card-border bg-white/2 hover:bg-white/6 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <Music className="w-4 h-4 text-accent-purple" />
            <span className="text-xs font-medium shrink-0 hidden sm:inline">
              {activeSound ? activeSound.name : "Sounds"}
            </span>
          </button>

          {soundMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setSoundMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-card-border bg-[#11141d] p-3 shadow-xl z-20">
                <p className="text-xs font-semibold text-gray-400 mb-2">Ambient Focus Sounds</p>
                <div className="space-y-1.5">
                  {(sounds as unknown as Array<{ id: AmbientSound; name: string; icon: React.ReactNode }>).map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => {
                        setAmbientSound(sound.id);
                      }}
                      className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        ambientSound === sound.id
                          ? "bg-accent-purple/20 text-accent-purple border border-accent-purple/30"
                          : "text-gray-300 hover:text-white hover:bg-white/4"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {sound.icon}
                        <span>{sound.name}</span>
                      </div>
                      {ambientSound === sound.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
                      )}
                    </button>
                  ))}
                </div>

                {ambientSound !== "none" && (
                  <div className="mt-4 pt-3 border-t border-card-border">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>Volume</span>
                      <span>{Math.round(volume * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <VolumeX className="w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent-purple"
                      />
                      <Volume2 className="w-3.5 h-3.5 text-gray-300" />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Monk Mode Toggle Button */}
        <button
          onClick={toggleMonkMode}
          className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            monkModeEnabled
              ? "bg-accent-purple/25 border-accent-purple text-accent-purple shadow-sm shadow-accent-purple/10"
              : "bg-white/2 border-card-border text-gray-400 hover:text-white hover:bg-white/5"
          }`}
          title={monkModeEnabled ? "Disable Monk Mode" : "Enable Monk Mode (Hides distracting elements)"}
        >
          {monkModeEnabled ? (
            <>
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Monk Mode On</span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" />
              <span className="hidden sm:inline">Monk Mode Off</span>
            </>
          )}
        </button>

        {/* Level and Streak (compact display) — hidden on small mobile */}
        {!monkModeEnabled && (
          <div className="hidden sm:flex items-center gap-4 border-l border-card-border pl-4">
            <div className="flex items-center gap-1.5 text-orange-500 font-semibold text-sm">
              <Flame className="w-4 h-4 fill-orange-500/20" />
              <span>{currentStreak}d</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded border border-physics/30 bg-physics/10 text-physics font-bold uppercase tracking-wider">
                Lvl {level}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
