"use client";

import { useState, useEffect, useRef } from "react";
import { Flower, ArrowLeft, Plus, Minus } from "lucide-react";
import { useProfile } from "../../components/useProfile";

const FlowerSVG = ({ type, size, color }: { type: number; size: number; color: string }) => {
  if (type === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="6" fill={color} />
        <circle cx="12" cy="6" r="3" fill={color} opacity="0.8" />
        <circle cx="16" cy="9" r="3" fill={color} opacity="0.8" />
        <circle cx="16" cy="14" r="3" fill={color} opacity="0.8" />
        <circle cx="12" cy="18" r="3" fill={color} opacity="0.8" />
        <circle cx="8" cy="14" r="3" fill={color} opacity="0.8" />
        <circle cx="8" cy="9" r="3" fill={color} opacity="0.8" />
        <circle cx="12" cy="12" r="2.5" fill="#FFE066" />
      </svg>
    );
  }
  if (type === 2) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="14" rx="3" ry="6" fill={color} />
        <ellipse cx="8" cy="10" rx="3" ry="5" fill={color} transform="rotate(-30 8 10)" />
        <ellipse cx="16" cy="10" rx="3" ry="5" fill={color} transform="rotate(30 16 10)" />
        <circle cx="12" cy="8" r="2.5" fill="#FFE066" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3C12 3 8 8 8 12C8 16 12 18 12 18C12 18 16 16 16 12C16 8 12 3 12 3Z" fill={color} />
      <path d="M12 6C12 6 10 9 10 12C10 14 12 15 12 15C12 15 14 14 14 12C14 9 12 6 12 6Z" fill="#FFE066" />
      <line x1="12" y1="18" x2="12" y2="22" stroke="#2D9B6B" strokeWidth="1.5" />
    </svg>
  );
};

export default function FlowersGame() {
  const { saveScore } = useProfile();
  const [gameState, setGameState] = useState<"intro" | "countdown" | "show" | "guess" | "result">("intro");
  const [count, setCount] = useState(3);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [flowerCount, setFlowerCount] = useState(0);
  const [userGuess, setUserGuess] = useState(150);
  const [flowers, setFlowers] = useState<{ x: number; y: number; size: number; type: number; color: string }[]>([]);
  const [showTime, setShowTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const maxRounds = 5;
  const minFlowers = 10;
  const maxFlowers = 300;

  const generateFlowers = () => {
    const count = Math.floor(Math.random() * (maxFlowers - minFlowers + 1)) + minFlowers;
    setFlowerCount(count);

    const newFlowers = [];
    const colors = ["#2D9B6B", "#3DB87C", "#4BC98D", "#5DD99E", "#6EEAAF"];
    for (let i = 0; i < count; i++) {
      newFlowers.push({
        x: Math.random() * 360 + 30,
        y: Math.random() * 360 + 30,
        size: Math.random() * 14 + 18,
        type: Math.floor(Math.random() * 3) + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setFlowers(newFlowers);
  };

  useEffect(() => {
    if (gameState === "countdown") {
      if (count > 0) {
        timerRef.current = setTimeout(() => setCount(count - 1), 1000);
      } else {
        generateFlowers();
        setGameState("show");
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState, count]);

  useEffect(() => {
    if (gameState === "show") {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setShowTime(Math.max(0, 3000 - elapsed));
      }, 50);

      timerRef.current = setTimeout(() => {
        clearInterval(interval);
        setShowTime(0);
        setGameState("guess");
      }, 3000);

      return () => {
        clearInterval(interval);
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [gameState]);

  const startGame = () => {
    setRound(1);
    setScore(0);
    setTotalScore(0);
    setUserGuess(150);
    setCount(3);
    setShowTime(0);
    setGameState("countdown");
  };

  const submitGuess = () => {
    const error = Math.abs(userGuess - flowerCount);
    const errorPct = error / flowerCount;
    const roundScore = Math.max(0, Math.round((1 - errorPct) * 100));

    setScore(roundScore);
    setTotalScore(s => s + roundScore);
    setGameState("result");
  };

  const nextRound = () => {
    if (round >= maxRounds) {
      saveScore("flowers", totalScore);
      window.location.href = "/";
      return;
    }
    setRound(r => r + 1);
    setUserGuess(150);
    setCount(3);
    setShowTime(0);
    setGameState("countdown");
  };

  const goToMain = () => {
    window.location.href = "/";
  };

  const formatTime = (ms: number) => {
    return (Math.max(0, ms) / 1000).toFixed(1);
  };

  const isPlaying = gameState !== "intro" && gameState !== "result";
  const isResult = gameState === "result";

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
            <div style={{ ...styles.cardIcon, background: "var(--accent-flowers-bg)" }}>
              <Flower size={40} style={{ color: "var(--accent-flowers)" }} />
            </div>
            <h1 style={{ ...styles.gameTitleText, color: "var(--accent-flowers)" }}>
              Цветочки
            </h1>
            <p style={styles.introDesc}>
              На экране появятся цветочки. Постарайся запомнить их количество.
              Чем точнее твой ответ — тем больше очков.
            </p>
            <div style={styles.rulesList}>
              <div style={styles.ruleItem}>
                <span style={styles.ruleNumber}>5</span>
                <span style={styles.ruleText}>раундов</span>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleNumber}>10–300</span>
                <span style={styles.ruleText}>цветков</span>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleNumber}>3 сек</span>
                <span style={styles.ruleText}>время</span>
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

  if (gameState === "countdown") {
    return (
      <div style={styles.container}>
        <header style={styles.topBar}>
          <button onClick={goToMain} className="icon-btn" style={styles.backBtn}>
            <ArrowLeft size={22} />
          </button>
          <div style={styles.gameTitle}>Раунд {round}/{maxRounds}</div>
          <div style={styles.scoreDisplay}>{totalScore} очков</div>
        </header>

        <main style={styles.gameMain}>
          <div style={styles.countdownBox}>
            <div style={styles.countdownNumber}>{count}</div>
            <p style={styles.countdownText}>Приготовься...</p>
          </div>
        </main>
      </div>
    );
  }

  if (gameState === "show") {
    return (
      <div style={styles.container}>
        <header style={styles.topBar}>
          <button onClick={goToMain} className="icon-btn" style={styles.backBtn}>
            <ArrowLeft size={22} />
          </button>
          <div style={styles.gameTitle}>Раунд {round}/{maxRounds}</div>
          <div style={styles.scoreDisplay}>{totalScore} очков</div>
        </header>

        <main style={styles.gameMain}>
          <div style={styles.gameAreaWrapper}>
            <div style={styles.flowersBox}>
              <svg width="420" height="420" style={styles.flowersSvg}>
                {flowers.map((f, i) => (
                  <g key={i} style={{ transform: `translate(${f.x}px, ${f.y}px)` }}>
                    <FlowerSVG type={f.type} size={f.size} color={f.color} />
                  </g>
                ))}
              </svg>
            </div>
            <div style={styles.timerBox}>
              <span style={styles.timerLabel}>Осталось</span>
              <span style={styles.timerValue}>{formatTime(showTime)}c</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (gameState === "guess") {
    return (
      <div style={styles.container}>
        <header style={styles.topBar}>
          <button onClick={goToMain} className="icon-btn" style={styles.backBtn}>
            <ArrowLeft size={22} />
          </button>
          <div style={styles.gameTitle}>Раунд {round}/{maxRounds}</div>
          <div style={styles.scoreDisplay}>{totalScore} очков</div>
        </header>

        <main style={styles.gameMain}>
          <div style={styles.guessCard}>
            <p style={styles.questionText}>Сколько цветочков ты видел?</p>

            <div style={styles.guessControls}>
              <button
                onClick={() => setUserGuess(Math.max(10, userGuess - 1))}
                style={styles.controlBtn}
              >
                <Minus size={20} />
              </button>

              <div style={styles.guessDisplay}>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={userGuess}
                  onChange={(e) => setUserGuess(Math.min(300, Math.max(10, parseInt(e.target.value) || 10)))}
                  style={styles.guessInput}
                />
                <span style={styles.guessLabel}>цветочков</span>
              </div>

              <button
                onClick={() => setUserGuess(Math.min(300, userGuess + 1))}
                style={styles.controlBtn}
              >
                <Plus size={20} />
              </button>
            </div>

            <div style={styles.sliderContainer}>
              <input
                type="range"
                min="10"
                max="300"
                value={userGuess}
                onChange={(e) => setUserGuess(parseInt(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.sliderLabels}>
                <span>10</span>
                <span>300</span>
              </div>
            </div>

            <button onClick={submitGuess} style={styles.submitBtn}>
              ответить
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
        <div style={styles.gameTitle}>Результат раунда</div>
        <div style={{ width: 44 }} />
      </header>

      <main style={styles.gameMain}>
        <div style={styles.resultCard}>
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

          <div style={styles.resultDetails}>
            <p>Было: <strong>{flowerCount}</strong></p>
            <p>Твой ответ: <strong>{userGuess}</strong></p>
          </div>

          <div style={styles.totalScore}>
            Всего очков: <strong>{totalScore}</strong>
          </div>

          <button onClick={nextRound} style={styles.nextBtn}>
            {round >= maxRounds ? "завершить" : "следующий раунд"}
          </button>
        </div>
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
    padding: "0 24px",
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
    background: "var(--accent-flowers)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: "16px",
    cursor: "pointer",
  },
  gameMain: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--space-8) var(--page-padding)",
  },
  countdownBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  countdownNumber: {
    fontFamily: "var(--font-display)",
    fontSize: "140px",
    color: "var(--accent-flowers)",
    lineHeight: 1,
  },
  countdownText: {
    fontFamily: "var(--font-heading)",
    fontWeight: 500,
    fontSize: "var(--text-xl)",
    color: "var(--text-secondary)",
    marginTop: "var(--space-4)",
  },
  gameAreaWithTimer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "40px",
    minWidth: "540px",
  },
  gameAreaWrapper: {
    minWidth: "540px",
    display: "flex",
    alignItems: "flex-start",
    gap: "40px",
  },
  flowersBox: {
    width: "420px",
    height: "420px",
    background: "#1A1916",
    borderRadius: "var(--radius-xl)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    overflow: "hidden",
    flexShrink: 0,
  },
  flowersSvg: {
    position: "absolute",
  },
  timerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: "20px",
    minWidth: "100px",
  },
  timerLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--text-tertiary)",
  },
  timerValue: {
    fontFamily: "var(--font-display)",
    fontSize: "48px",
    color: "#1A1916",
  },
  guessCard: {
    background: "var(--bg-surface)",
    border: "1.5px solid var(--border-subtle)",
    borderRadius: "var(--radius-xl)",
    padding: "40px",
    maxWidth: "480px",
    width: "100%",
    boxShadow: "var(--shadow-elevated)",
    textAlign: "center",
  },
  questionText: {
    fontFamily: "var(--font-heading)",
    fontWeight: 600,
    fontSize: "var(--text-xl)",
    color: "var(--text-primary)",
    marginBottom: "var(--space-6)",
  },
  guessControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--space-6)",
    marginBottom: "var(--space-4)",
    minWidth: "320px",
  },
  controlBtn: {
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
  guessDisplay: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  guessInput: {
    width: "130px",
    padding: "12px 16px",
    border: "2px solid var(--border-medium)",
    borderRadius: "var(--radius-md)",
    fontSize: "28px",
    textAlign: "center",
    background: "var(--bg-surface)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-display)",
  },
  guessLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-sm)",
    color: "var(--text-secondary)",
  },
  sliderContainer: {
    marginBottom: "var(--space-6)",
  },
  slider: {
    width: "100%",
    height: "8px",
    borderRadius: "var(--radius-full)",
    appearance: "none",
    background: "var(--border-medium)",
    outline: "none",
  },
  sliderLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "var(--space-2)",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-xs)",
    color: "var(--text-tertiary)",
  },
  submitBtn: {
    padding: "14px 40px",
    background: "var(--accent-flowers)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: "16px",
    cursor: "pointer",
  },
  resultCard: {
    background: "var(--bg-surface)",
    border: "1.5px solid var(--border-subtle)",
    borderRadius: "var(--radius-xl)",
    padding: "48px",
    maxWidth: "420px",
    width: "100%",
    boxShadow: "var(--shadow-elevated)",
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
  resultDetails: {
    marginTop: "var(--space-6)",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-base)",
    color: "var(--text-secondary)",
  },
  totalScore: {
    marginTop: "var(--space-6)",
    padding: "var(--space-3)",
    background: "var(--bg-overlay)",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-base)",
  },
  nextBtn: {
    marginTop: "var(--space-6)",
    padding: "14px 40px",
    background: "var(--accent-flowers)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: "16px",
    cursor: "pointer",
  },
};