"use client";

import { useState, useEffect, useRef } from "react";
import { Flower, ArrowLeft, Plus, Minus } from "lucide-react";
import { useProfile } from "../../components/useProfile";

const flowerShapes = ["bloom-1", "bloom-2", "bloom-3", "bloom-4", "bloom-5"] as const;
const flowerShadow = [
  "rgba(241, 91, 181, 0.4)",
  "rgba(255, 140, 66, 0.35)",
  "rgba(46, 196, 182, 0.35)",
  "rgba(75, 180, 255, 0.35)",
  "rgba(123, 211, 137, 0.35)",
];

const FlowerSVG = ({ variant, size }: { variant: number; size: number }) => {
  const flowerIndex = Math.abs(variant) % flowerShapes.length;
  const fileName = flowerShapes[flowerIndex];
  const shadow = flowerShadow[flowerIndex] ?? "rgba(0,0,0,0.15)";
  return (
    <img
      src={`/assets/flowers/${fileName}.svg`}
      alt=""
      width={size}
      height={size}
      style={{
        display: "block",
        width: size,
        height: size,
        objectFit: "contain",
        filter: `drop-shadow(0 3px 8px ${shadow})`
      }}
      draggable={false}
    />
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
  const [flowers, setFlowers] = useState<{ x: number; y: number; size: number; rotation: number; variant: number }[]>([]);
  const [showTime, setShowTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const maxRounds = 5;
  const minFlowers = 10;
  const maxFlowers = 300;

  const generateFlowers = () => {
    const count = Math.floor(Math.random() * (maxFlowers - minFlowers + 1)) + minFlowers;
    setFlowerCount(count);

    const newFlowers = [];
    const fieldSize = 420;
    const padding = 10;
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 16 + 18;
      newFlowers.push({
        x: Math.random() * (fieldSize - size - padding * 2) + padding,
        y: Math.random() * (fieldSize - size - padding * 2) + padding,
        size,
        rotation: Math.random() * 360,
        variant: Math.floor(Math.random() * flowerShapes.length),
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
          <div className="game-layout game-layout--flowers">
            <div style={styles.flowersBox}>
              <div style={styles.flowersCanvas}>
                {flowers.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      transform: `translate(${f.x}px, ${f.y}px) rotate(${f.rotation}deg)`,
                    }}
                  >
                    <FlowerSVG variant={f.variant} size={f.size} />
                  </div>
                ))}
              </div>
            </div>
            <div className="timer-stack" style={styles.timerBox}>
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
    gap: "32px",
    width: "100%",
    maxWidth: "680px",
  },
  flowersBox: {
    width: "420px",
    height: "420px",
    background: "#151312",
    borderRadius: "var(--radius-xl)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 36px rgba(26,25,22,0.28)",
    overflow: "hidden",
    flexShrink: 0,
    position: "relative",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  flowersCanvas: {
    position: "absolute",
    inset: 0,
  },
  timerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: "12px",
    minWidth: "120px",
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
    fontVariantNumeric: "tabular-nums",
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
