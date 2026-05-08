"use client";

import { useState, useEffect, useRef } from "react";
import { Zap, ArrowLeft } from "lucide-react";
import { useProfile } from "../../components/useProfile";

export default function F1Game() {
  const { saveScore } = useProfile();
  const [gameState, setGameState] = useState<"intro" | "lights" | "ready" | "go" | "result">("intro");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [lightsOn, setLightsOn] = useState(0);
  const [lightsReady, setLightsReady] = useState(false);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [showTime, setShowTime] = useState(0);
  const [falseStart, setFalseStart] = useState(false);
  const [message, setMessage] = useState("");
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxRounds = 5;

  const goToMain = () => {
    window.location.href = "/";
  };

  const isPlaying = gameState !== "intro" && gameState !== "result";

  const startGame = () => {
    setRound(1);
    setScore(0);
    setTotalScore(0);
    startRound();
  };

  const startRound = () => {
    setLightsOn(0);
    setLightsReady(false);
    setFalseStart(false);
    setReactionTime(null);
    setMessage("");
    setGameState("lights");
    
    let currentLight = 0;
    const lightInterval = setInterval(() => {
      currentLight++;
      setLightsOn(currentLight);
      if (currentLight >= 5) {
        clearInterval(lightInterval);
        setLightsReady(true);
        
        const delay = Math.random() * 2000 + 1500;
        
        timeoutRef.current = setTimeout(() => {
          setLightsOn(0);
          setGameState("go");
          setStartTime(Date.now());
          
          timeoutRef.current = setTimeout(() => {
            if (gameState !== "result") {
              setMessage("Промах! (время вышло)");
              setGameState("result");
              setScore(0);
            }
          }, 10000);
        }, delay);
      }
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameState === "go") {
      const startTimeRef = Date.now();
      const interval = setInterval(() => {
        setShowTime(Date.now() - startTimeRef);
      }, 16);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const handleClick = () => {
    if (gameState === "intro") {
      startGame();
      return;
    }

    if (gameState === "lights" && !lightsReady) {
      setFalseStart(true);
      setMessage("Фальстарт!");
      setGameState("result");
      setScore(0);
      return;
    }

    if (gameState === "go") {
      const endTime = Date.now();
      const reaction = endTime - startTime;
      setReactionTime(reaction);
      
      const roundScore = Math.max(0, Math.round(1000 - reaction));
      setScore(roundScore);
      setTotalScore(s => s + roundScore);
      setGameState("result");
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const nextRound = () => {
    if (round >= maxRounds) {
      saveScore("f1", totalScore);
      setGameState("intro");
      return;
    }
    setRound(r => r + 1);
    startRound();
  };

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2) + "c";
  };

  if (gameState === "intro") {
    return (
      <div style={styles.container}>
        <header style={styles.topBar}>
          <button onClick={goToMain} className="icon-btn" style={styles.backBtn}>
            <ArrowLeft size={22} />
          </button>
          <div style={styles.gameTitle}>glazik game</div>
          <div style={{ width: 44 }} />
        </header>

        <main style={styles.introMain}>
          <div style={styles.introCard}>
            <div style={{ ...styles.cardIcon, background: "var(--accent-f1-bg)" }}>
              <Zap size={40} style={{ color: "var(--accent-f1)" }} />
            </div>
            <h1 style={{ ...styles.gameTitleText, color: "var(--accent-f1)" }}>
              Светофор F1
            </h1>
            <p style={styles.introDesc}>
              Жди, пока загорятся все 5 огней. Как только погаснут — жми как можно быстрее!
              Фальстарт = 0 очков.
            </p>
            <div style={styles.rulesList}>
              <div style={styles.ruleItem}>
                <span style={styles.ruleNumber}>5</span>
                <span style={styles.ruleText}>раундов</span>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleNumber}>5 огней</span>
                <span style={styles.ruleText}>зажигаются</span>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleNumber}>1000</span>
                <span style={styles.ruleText}>макс очков</span>
              </div>
            </div>
            <button onClick={startGame} style={styles.playBtn}>
              начать игру
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.topBar}>
        <button onClick={goToMain} className="icon-btn" style={styles.backBtn}>
          <ArrowLeft size={22} />
        </button>
        <div style={styles.gameTitle}>
          {gameState === "result" ? "Результат" : `Раунд ${round}/${maxRounds}`}
        </div>
        <div style={styles.scoreDisplay}>{totalScore} очков</div>
      </header>

      <main style={styles.gameMain}>
        <div style={styles.gameArea} onClick={handleClick}>
          <div style={styles.lightsContainer}>
            {[0, 1, 2, 3, 4].map(i => (
              <div 
                key={i}
                style={{
                  ...styles.light,
                  background: i < lightsOn ? "#CC0000" : "#2A2723",
                  border: i < lightsOn ? "2px solid rgba(255,255,255,0.1)" : "2px solid rgba(255,255,255,0.08)",
                  boxShadow: i < lightsOn ? "0 0 20px rgba(204,0,0,0.7)" : "none",
                }}
              />
            ))}
          </div>
          
          <div style={styles.messageArea}>
            {gameState === "lights" && !lightsReady && (
              <p style={styles.waitText}>Зажигаются...</p>
            )}
            {gameState === "lights" && lightsReady && (
              <p style={styles.readyText}>Жди...</p>
            )}
            {gameState === "go" && (
              <div style={styles.goArea}>
                <p style={styles.goText}>ЖМИ!</p>
                <span style={styles.timeText}>{formatTime(showTime)}</span>
              </div>
            )}
            {gameState === "result" && message && (
              <p style={styles.messageText}>{message}</p>
            )}
          </div>
        </div>

        {gameState === "result" && (
          <div style={styles.resultSection}>
            <div style={styles.resultScore}>
              <span style={{ 
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-display)",
                color: "var(--text-primary)",
              }}>
                {score}
              </span>
              <span style={styles.resultLabel}>очков</span>
            </div>
            
            {reactionTime !== null && (
              <div style={styles.reactionTime}>
                Время реакции: <strong>{formatTime(reactionTime)}</strong>
              </div>
            )}

            <div style={styles.totalScore}>
              Всего очков: <strong>{totalScore}</strong>
            </div>

            <button onClick={nextRound} style={styles.nextBtn}>
              {round >= maxRounds ? "завершить" : "следующий раунд"}
            </button>
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
    height: "64px",
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "transparent",
  },
  backBtn: {
    width: "44px",
    height: "44px",
    borderRadius: "var(--radius-md)",
    border: "1.5px solid var(--border-subtle)",
    background: "transparent",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  logoDisabled: {
    fontFamily: "var(--font-heading)",
    fontWeight: 600,
    fontSize: "22px",
    color: "var(--text-tertiary)",
    cursor: "default",
  },
  gameTitle: {
    fontFamily: "var(--font-heading)",
    fontWeight: 600,
    fontSize: "18px",
    color: "var(--text-primary)",
  },
  scoreDisplay: {
    fontFamily: "var(--font-body)",
    fontWeight: 500,
    fontSize: "15px",
    color: "var(--text-secondary)",
    minWidth: "80px",
    textAlign: "right",
  },
  introMain: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--space-8) var(--page-padding)",
  },
  introCard: {
    background: "var(--bg-surface)",
    border: "1.5px solid var(--border-subtle)",
    borderRadius: "var(--radius-xl)",
    padding: "48px",
    maxWidth: "440px",
    width: "100%",
    boxShadow: "var(--shadow-elevated)",
    textAlign: "center",
  },
  cardIcon: {
    width: "72px",
    height: "72px",
    borderRadius: "var(--radius-lg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },
  gameTitleText: {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-2xl)",
    marginTop: "var(--space-4)",
  },
  introDesc: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-base)",
    color: "var(--text-secondary)",
    marginTop: "var(--space-4)",
    lineHeight: 1.6,
  },
  rulesList: {
    display: "flex",
    justifyContent: "center",
    gap: "var(--space-8)",
    marginTop: "var(--space-6)",
    flexWrap: "wrap",
  },
  ruleItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  ruleNumber: {
    fontFamily: "var(--font-heading)",
    fontWeight: 600,
    fontSize: "var(--text-xl)",
    color: "var(--text-primary)",
  },
  ruleText: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-xs)",
    color: "var(--text-tertiary)",
    marginTop: "4px",
  },
  playBtn: {
    marginTop: "var(--space-8)",
    padding: "14px 40px",
    background: "var(--accent-f1)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: "16px",
    cursor: "pointer",
    transition: "all var(--duration-base) var(--ease-out)",
  },
  gameMain: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--space-8) var(--page-padding)",
  },
  gameArea: {
    width: "100%",
    maxWidth: "600px",
    minHeight: "400px",
    background: "var(--bg-surface)",
    border: "1.5px solid var(--border-subtle)",
    borderRadius: "var(--radius-xl)",
    padding: "60px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--space-8)",
    boxShadow: "0 16px 40px rgba(26,25,22,0.16)",
  },
  lightsContainer: {
    display: "flex",
    gap: "24px",
  },
  light: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    transition: "all 150ms ease-in",
  },
  messageArea: {
    minHeight: "80px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  waitText: {
    fontFamily: "var(--font-heading)",
    fontWeight: 500,
    fontSize: "var(--text-lg)",
    color: "var(--text-secondary)",
  },
  readyText: {
    fontFamily: "var(--font-heading)",
    fontWeight: 600,
    fontSize: "var(--text-xl)",
    color: "var(--accent-f1)",
  },
  goArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  goText: {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-2xl)",
    color: "var(--accent-f1)",
  },
  timeText: {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-xl)",
    color: "var(--text-tertiary)",
    fontVariantNumeric: "tabular-nums",
  },
  messageText: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-base)",
    color: "var(--danger)",
  },
  resultSection: {
    marginTop: "var(--space-6)",
    textAlign: "center",
  },
  resultScore: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  resultLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-sm)",
    color: "var(--text-secondary)",
    marginTop: "var(--space-1)",
  },
  reactionTime: {
    marginTop: "var(--space-4)",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-base)",
    color: "var(--text-secondary)",
  },
  totalScore: {
    marginTop: "var(--space-4)",
    padding: "var(--space-3)",
    background: "var(--bg-overlay)",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-base)",
  },
  nextBtn: {
    marginTop: "var(--space-6)",
    padding: "14px 40px",
    background: "var(--accent-f1)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: "16px",
    cursor: "pointer",
  },
};
