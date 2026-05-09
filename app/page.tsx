"use client";

import { useState } from "react";
import { Flower, Zap, Palette, Sun, Moon, Volume2, VolumeX, User } from "lucide-react";
import { useTheme } from "./components/ThemeProvider";
import { useLanguage } from "./components/LanguageProvider";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const [sound, setSound] = useState(true);

  const games = [
    {
      id: "flowers",
      icon: Flower,
      title: t.home.cards.flowers.title,
      description: t.home.cards.flowers.description,
      tag: t.home.cards.flowers.tag,
      color: "flowers",
    },
    {
      id: "f1",
      icon: Zap,
      title: t.home.cards.f1.title,
      description: t.home.cards.f1.description,
      tag: t.home.cards.f1.tag,
      color: "f1",
    },
    {
      id: "color",
      icon: Palette,
      title: t.home.cards.color.title,
      description: t.home.cards.color.description,
      tag: t.home.cards.color.tag,
      color: "color",
    },
  ];

  const navLinks = [
    { label: t.nav.flowers, href: "/game/flowers" },
    { label: t.nav.f1, href: "/game/f1" },
    { label: t.nav.color, href: "/game/color" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="top-bar">
        <a href="/" style={styles.brand}>glazik</a>

        <nav className="nav">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div style={styles.iconButtons}>
          <button
            onClick={() => setSound(!sound)}
            className="icon-btn"
            style={styles.iconButton}
            aria-label={sound ? t.actions.soundOff : t.actions.soundOn}
          >
            {sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            onClick={toggleTheme}
            className="icon-btn"
            style={styles.iconButton}
            aria-label={theme === "light" ? t.actions.darkTheme : t.actions.lightTheme}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <a href="/profile" className="icon-btn" style={styles.iconButton} aria-label={t.actions.profile}>
            <User size={18} />
          </a>
        </div>
      </header>

      <main className="main">
        <div style={styles.hero}>
          <span className="hero-label">{t.home.heroLabel}</span>
          <h1 className="hero-title">{t.home.heroTitle}</h1>
          <p className="hero-subtitle">{t.home.heroSubtitle}</p>
        </div>

        <div className="cards-grid">
          {games.map(game => (
            <a
              key={game.id}
              href={`/game/${game.id}`}
              className="card"
              style={{
                background: `var(--accent-${game.color}-bg)`,
              } as React.CSSProperties}
            >
              <div style={{
                ...styles.cardIcon,
                background: "rgba(255,255,255,0.7)",
              }}>
                <game.icon size={22} style={{ color: `var(--accent-${game.color})` }} />
              </div>
              <h3 style={{ ...styles.cardTitle, color: "var(--accent-" + game.color + ")" }}>{game.title}</h3>
              <p style={styles.cardDesc}>{game.description}</p>
              <span style={{
                ...styles.cardTag,
                background: "rgba(255,255,255,0.7)",
                color: `var(--accent-${game.color})`,
                marginTop: "auto",
              }}>
                {game.tag}
              </span>
            </a>
          ))}
        </div>
      </main>

      <footer style={styles.footer}>
        <a href="#">{t.brand}</a>
        <span style={styles.footerDivider}>·</span>
        <a href="#">{t.footer.about}</a>
        <span style={styles.footerDivider}>·</span>
        <a href="#">{t.footer.privacy}</a>
        <span style={styles.footerDivider}>·</span>
        <a href="https://github.com" target="_blank" rel="noopener">{t.footer.github}</a>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  brand: {
    fontFamily: "var(--font-heading)",
    fontWeight: 600,
    fontSize: "28px",
    color: "var(--text-primary)",
    letterSpacing: "-0.5px",
  },
  iconButtons: {
    display: "flex",
    gap: "4px",
  },
  iconButton: {
    width: "32px",
    height: "32px",
    borderRadius: "var(--radius-sm)",
    border: "1.5px solid var(--border-subtle)",
    background: "transparent",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    textAlign: "center",
    marginBottom: "var(--space-12)",
  },
  card: {
    background: "var(--bg-surface)",
    border: "1.5px solid var(--border-subtle)",
    borderRadius: "var(--radius-xl)",
    padding: "28px",
    boxShadow: "var(--shadow-card)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    transition: "box-shadow var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out)",
    cursor: "pointer",
    minHeight: "240px",
  },
  cardIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "var(--radius-lg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontFamily: "var(--font-heading)",
    fontWeight: 600,
    fontSize: "20px",
    color: "var(--text-primary)",
    marginTop: "16px",
  },
  cardDesc: {
    fontFamily: "var(--font-body)",
    fontWeight: 400,
    fontSize: "15px",
    color: "var(--text-secondary)",
    marginTop: "var(--space-2)",
    lineHeight: 1.5,
  },
  cardTag: {
    fontFamily: "var(--font-body)",
    fontWeight: 500,
    fontSize: "12px",
    padding: "3px 10px",
    borderRadius: "var(--radius-full)",
    marginTop: "var(--space-3)",
  },
  footer: {
    padding: "var(--space-6) var(--page-padding)",
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "var(--text-tertiary)",
  },
  footerDivider: {
    opacity: 0.5,
  },
};
