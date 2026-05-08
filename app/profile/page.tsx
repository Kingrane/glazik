"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, User, Trophy, Clock } from "lucide-react";

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

export default function Profile() {
  const [data, setData] = useState<ProfileData>({
    nickname: "Игрок",
    bestScores: { flowers: 0, f1: 0, color: 0 },
    lastRuns: [],
  });
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("glazik-profile");
    if (saved) {
      setData(JSON.parse(saved));
      setNickname(JSON.parse(saved).nickname);
    }
  }, []);

  const saveNickname = () => {
    const newData = { ...data, nickname: nickname || "Игрок" };
    setData(newData);
    localStorage.setItem("glazik-profile", JSON.stringify(newData));
    setEditing(false);
  };

  const goBack = () => {
    window.location.href = "/";
  };

  const totalBest = data.bestScores.flowers + data.bestScores.f1 + data.bestScores.color;

  return (
    <div style={styles.container}>
      <header style={styles.topBar}>
        <button onClick={goBack} className="icon-btn" style={styles.backBtn}>
          <ArrowLeft size={20} />
        </button>
        <div style={styles.gameTitle}>
          <User size={22} />
          <span>Профиль</span>
        </div>
        <div style={{ width: 40 }} />
      </header>

      <main style={styles.main}>
        <div style={styles.profileCard}>
          <div style={styles.avatar}>
            <User size={48} style={{ color: "var(--text-secondary)" }} />
          </div>
          
          {editing ? (
            <div style={styles.editName}>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                style={styles.nameInput}
                placeholder="Введи имя"
                autoFocus
              />
              <button onClick={saveNickname} style={styles.saveBtn}>
                сохранить
              </button>
            </div>
          ) : (
            <div style={styles.nameRow} onClick={() => setEditing(true)}>
              <h2 style={styles.nickname}>{data.nickname}</h2>
              <span style={styles.editHint}>изменить</span>
            </div>
          )}
        </div>

        <div style={styles.statsSection}>
          <h3 style={styles.sectionTitle}>
            <Trophy size={18} />
            Личные рекорды
          </h3>
          
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Цветочки</span>
              <span style={styles.statValue}>{data.bestScores.flowers}</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Светофор F1</span>
              <span style={styles.statValue}>{data.bestScores.f1}</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Цвет</span>
              <span style={styles.statValue}>{data.bestScores.color}</span>
            </div>
            <div style={{ ...styles.statCard, background: "var(--accent-color-bg)" }}>
              <span style={{ ...styles.statLabel, color: "var(--accent-color)" }}>Всего</span>
              <span style={{ ...styles.statValue, color: "var(--accent-color)" }}>{totalBest}</span>
            </div>
          </div>
        </div>

        {data.lastRuns.length > 0 && (
          <div style={styles.historySection}>
            <h3 style={styles.sectionTitle}>
              <Clock size={18} />
              Последние игры
            </h3>
            
            <div style={styles.historyList}>
              {data.lastRuns.slice(0, 10).map((run, i) => (
                <div key={i} style={styles.historyItem}>
                  <span style={styles.historyGame}>{run.game}</span>
                  <span style={styles.historyScore}>{run.score} очков</span>
                  <span style={styles.historyDate}>{run.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.lastRuns.length === 0 && (
          <div style={styles.emptyState}>
            Пока нет сыгранных игр. Начни играть!
          </div>
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  topBar: {
    height: "56px",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0))",
    borderBottom: "1px solid var(--border-subtle)",
    backdropFilter: "blur(8px)",
  },
  backBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "var(--radius-md)",
    border: "none",
    background: "transparent",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  gameTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontFamily: "var(--font-heading)",
    fontWeight: 600,
    fontSize: "17px",
  },
  main: {
    flex: 1,
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
    padding: "var(--space-8) var(--page-padding)",
  },
  profileCard: {
    background: "var(--bg-surface)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-xl)",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "var(--shadow-elevated)",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "var(--radius-full)",
    background: "var(--bg-overlay)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  nameRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "var(--space-4)",
    cursor: "pointer",
  },
  nickname: {
    fontFamily: "var(--font-heading)",
    fontWeight: 600,
    fontSize: "var(--text-xl)",
    color: "var(--text-primary)",
  },
  editHint: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-xs)",
    color: "var(--text-tertiary)",
    marginTop: "var(--space-1)",
  },
  editName: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--space-3)",
    marginTop: "var(--space-4)",
  },
  nameInput: {
    padding: "8px 16px",
    border: "1px solid var(--border-medium)",
    borderRadius: "var(--radius-md)",
    fontSize: "var(--text-base)",
    background: "var(--bg-surface)",
    color: "var(--text-primary)",
    textAlign: "center",
  },
  saveBtn: {
    padding: "8px 20px",
    background: "var(--accent-color)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-body)",
    fontWeight: 500,
    cursor: "pointer",
  },
  statsSection: {
    marginTop: "var(--space-6)",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontFamily: "var(--font-heading)",
    fontWeight: 600,
    fontSize: "var(--text-lg)",
    color: "var(--text-primary)",
    marginBottom: "var(--space-4)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  statCard: {
    background: "var(--bg-surface)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-lg)",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 8px 20px rgba(26,25,22,0.08)",
  },
  statLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-xs)",
    color: "var(--text-tertiary)",
  },
  statValue: {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-2xl)",
    color: "var(--text-primary)",
    marginTop: "var(--space-1)",
  },
  historySection: {
    marginTop: "var(--space-6)",
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    background: "var(--bg-surface)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-md)",
  },
  historyGame: {
    fontFamily: "var(--font-body)",
    fontWeight: 500,
    fontSize: "var(--text-sm)",
    color: "var(--text-primary)",
  },
  historyScore: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-sm)",
    color: "var(--text-secondary)",
  },
  historyDate: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-xs)",
    color: "var(--text-tertiary)",
  },
  emptyState: {
    textAlign: "center",
    padding: "var(--space-8)",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-base)",
    color: "var(--text-tertiary)",
  },
};
