"use client";

import { useState, useEffect, useRef } from "react";
import { Palette, ArrowLeft } from "lucide-react";
import { useProfile } from "../../components/useProfile";

export default function ColorGame() {
  const { saveScore } = useProfile();
  const [gameState, setGameState] = useState<"intro" | "countdown" | "show" | "guess" | "result">("intro");
  const [count, setCount] = useState(3);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [targetColor, setTargetColor] = useState({ r: 0, g: 0, b: 0 });
  const [userColor, setUserColor] = useState({ r: 127, g: 127, b: 127 });
  const [showTime, setShowTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const maxRounds = 5;

  const goToMain = () => {
    window.location.href = "/";
  };

  const generateColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    setTargetColor({ r, g, b });
  };

  useEffect(() => {
    if (gameState === "countdown") {
      if (count > 0) {
        timerRef.current = setTimeout(() => setCount(count - 1), 1000);
      } else {
        generateColor();
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
        setShowTime(Math.max(0, 5000 - (Date.now() - startTime)));
      }, 50);
      
      timerRef.current = setTimeout(() => {
        clearInterval(interval);
        setShowTime(0);
        setGameState("guess");
      }, 5000);
      
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
    setUserColor({ r: 127, g: 127, b: 127 });
    setCount(3);
    setShowTime(0);
    setGameState("countdown");
  };

  const calculateDistance = () => {
    const dr = targetColor.r - userColor.r;
    const dg = targetColor.g - userColor.g;
    const db = targetColor.b - userColor.b;
    const distance = Math.sqrt(dr * dr + dg * dg + db * db);
    const maxDistance = Math.sqrt(255 * 255 * 3);
    return distance / maxDistance;
  };

  const submitGuess = () => {
    const distance = calculateDistance();
    const roundScore = Math.max(0, Math.round((1 - distance) * 100));
    setScore(roundScore);
    setTotalScore(s => s + roundScore);
    setGameState("result");
  };

  const nextRound = () => {
    if (round >= maxRounds) {
      saveScore("color", totalScore);
      window.location.href = "/";
      return;
    }
    setRound(r => r + 1);
    setUserColor({ r: 127, g: 127, b: 127 });
    setCount(3);
    setShowTime(0);
    setGameState("countdown");
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
  };

  const rgbLabel = (r: number, g: number, b: number) => {
    return `RGB ${r} ${g} ${b}`;
  };

  const formatTime = (ms: number) => {
    return (Math.max(0, ms) / 1000).toFixed(1);
  };

  const isPlaying = gameState !== "intro" && gameState !== "result";

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
            <div style={{ ...styles.cardIcon, background: "var(--accent-color-bg)" }}>
              <Palette size={40} style={{ color: "var(--accent-color)" }} />
            </div>
            <h1 style={{ ...styles.gameTitleText, color: "var(--accent-color)" }}>
              Угадай цвет
            </h1>
            <p style={styles.introDesc}>
              Запомни цвет, который появится на 5 секунд. Затем воспроизведи его 
              с помощью ползунков RGB. Чем точнее — тем больше очков.
            </p>
            <div style={styles.rulesList}>
              <div style={styles.ruleItem}>
                <span style={styles.ruleNumber}>5</span>
                <span style={styles.ruleText}>раундов</span>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleNumber}>5 сек</span>
                <span style={styles.ruleText}>запоминание</span>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.ruleNumber}>100</span>
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
          <div className="game-layout game-layout--color">
            <div style={{
              ...styles.bigColorBox,
              background: rgbToHex(targetColor.r, targetColor.g, targetColor.b),
            }} />
            <div className="timer-stack" style={styles.timerBox}>
              <span style={styles.timerLabel}>Осталось</span>
              <span style={styles.timerValueBlack}>{formatTime(showTime)}c</span>
            </div>
          </div>
          <p style={styles.rememberText}>Запомни этот цвет</p>
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
            <p style={styles.questionText}>Воспроизведи цвет</p>
            
            <div style={styles.bigPreviewSection}>
              <div style={styles.previewLabel}>Твой цвет</div>
              <div style={{
                ...styles.bigUserPreview,
                background: rgbToHex(userColor.r, userColor.g, userColor.b),
              }} />
            </div>

            <div style={styles.sliders}>
              <div style={styles.sliderRow}>
                <label style={styles.sliderLabel}>R</label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={userColor.r}
                  onChange={(e) => setUserColor({ ...userColor, r: parseInt(e.target.value) })}
                  style={styles.slider}
                />
                <span style={styles.sliderValue}>{userColor.r}</span>
              </div>
              <div style={styles.sliderRow}>
                <label style={styles.sliderLabel}>G</label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={userColor.g}
                  onChange={(e) => setUserColor({ ...userColor, g: parseInt(e.target.value) })}
                  style={styles.slider}
                />
                <span style={styles.sliderValue}>{userColor.g}</span>
              </div>
              <div style={styles.sliderRow}>
                <label style={styles.sliderLabel}>B</label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={userColor.b}
                  onChange={(e) => setUserColor({ ...userColor, b: parseInt(e.target.value) })}
                  style={styles.slider}
                />
                <span style={styles.sliderValue}>{userColor.b}</span>
              </div>
            </div>

            <button onClick={submitGuess} style={styles.submitBtn}>
              проверить
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

          <div style={styles.resultColors}>
            <div style={styles.resultColorCard}>
              <div style={styles.resultColorLabel}>Правильный цвет</div>
              <div style={{
                ...styles.bigColorResult,
                background: rgbToHex(targetColor.r, targetColor.g, targetColor.b),
              }} />
              <div style={styles.resultRgb}>{rgbLabel(targetColor.r, targetColor.g, targetColor.b)}</div>
            </div>
            <div style={styles.resultColorCard}>
              <div style={styles.resultColorLabel}>Твой цвет</div>
              <div style={{
                ...styles.bigColorResult,
                background: rgbToHex(userColor.r, userColor.g, userColor.b),
              }} />
              <div style={styles.resultRgb}>{rgbLabel(userColor.r, userColor.g, userColor.b)}</div>
            </div>
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
    background: "var(--accent-color)",
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
    flexDirection: "column",
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
    color: "var(--accent-color)",
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
  bigColorBox: {
    width: "400px",
    height: "400px",
    borderRadius: "var(--radius-xl)",
    border: "1px solid rgba(26,25,22,0.12)",
    boxShadow: "0 16px 44px rgba(26,25,22,0.2)",
    flexShrink: 0,
  },
  timerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: "12px",
    width: "140px",
  },
  timerLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--text-tertiary)",
  },
  timerValueBlack: {
    fontFamily: "var(--font-display)",
    fontSize: "48px",
    color: "#1A1916",
    fontVariantNumeric: "tabular-nums",
  },
  rememberText: {
    fontFamily: "var(--font-heading)",
    fontWeight: 500,
    fontSize: "var(--text-xl)",
    color: "var(--text-primary)",
    marginTop: "var(--space-6)",
  },
  guessCard: {
    background: "var(--bg-surface)",
    border: "1.5px solid var(--border-subtle)",
    borderRadius: "var(--radius-xl)",
    padding: "40px",
    maxWidth: "520px",
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
  bigPreviewSection: {
    marginBottom: "var(--space-6)",
  },
  previewLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--text-tertiary)",
    marginBottom: "12px",
  },
  bigUserPreview: {
    width: "200px",
    height: "200px",
    borderRadius: "var(--radius-xl)",
    border: "1.5px solid var(--border-subtle)",
    margin: "0 auto",
    boxShadow: "var(--shadow-elevated)",
  },
  sliders: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-4)",
    marginBottom: "var(--space-6)",
  },
  sliderRow: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
  },
  sliderLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--text-secondary)",
    width: "24px",
  },
  slider: {
    flex: 1,
    height: "8px",
    borderRadius: "var(--radius-full)",
    appearance: "none",
    background: "var(--border-medium)",
    outline: "none",
  },
  sliderValue: {
    fontFamily: "var(--font-mono)",
    fontSize: "14px",
    color: "var(--text-tertiary)",
    width: "36px",
    textAlign: "right",
  },
  submitBtn: {
    padding: "14px 40px",
    background: "var(--accent-color)",
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
    maxWidth: "720px",
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
  resultColors: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: "var(--space-8)",
    marginTop: "var(--space-6)",
    flexWrap: "wrap",
  },
  resultColorCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--space-2)",
  },
  resultColorLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    color: "var(--text-tertiary)",
  },
  resultRgb: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--text-secondary)",
    letterSpacing: "0.02em",
  },
  bigColorResult: {
    width: "240px",
    height: "240px",
    borderRadius: "var(--radius-xl)",
    border: "1px solid var(--border-subtle)",
    boxShadow: "var(--shadow-elevated)",
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
    background: "var(--accent-color)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: "16px",
    cursor: "pointer",
  },
};
