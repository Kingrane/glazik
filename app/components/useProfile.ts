"use client";

import { useState, useEffect, useCallback } from "react";

interface ProfileData {
  nickname: string;
  bestScores: {
    flowers: number;
    f1: number;
    color: number;
  };
  lastRuns: {
    game: string;
    score: number;
    date: string;
  }[];
}

const defaultProfile: ProfileData = {
  nickname: "Игрок",
  bestScores: { flowers: 0, f1: 0, color: 0 },
  lastRuns: [],
};

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  useEffect(() => {
    const saved = localStorage.getItem("glazik-profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const saveScore = useCallback((game: "flowers" | "f1" | "color", score: number) => {
    const gameNames = {
      flowers: "Цветочки",
      f1: "Светофор F1",
      color: "Цвет",
    };

    const newBest = Math.max(profile.bestScores[game], score);
    const newRuns = [
      {
        game: gameNames[game],
        score,
        date: new Date().toLocaleDateString("ru-RU"),
      },
      ...profile.lastRuns.slice(0, 9),
    ];

    const newProfile: ProfileData = {
      ...profile,
      bestScores: {
        ...profile.bestScores,
        [game]: newBest,
      },
      lastRuns: newRuns,
    };

    setProfile(newProfile);
    localStorage.setItem("glazik-profile", JSON.stringify(newProfile));
  }, [profile]);

  const updateNickname = useCallback((nickname: string) => {
    const newProfile = { ...profile, nickname: nickname || "Игрок" };
    setProfile(newProfile);
    localStorage.setItem("glazik-profile", JSON.stringify(newProfile));
  }, [profile]);

  return { profile, saveScore, updateNickname };
}