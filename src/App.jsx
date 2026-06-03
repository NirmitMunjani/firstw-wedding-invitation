import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Volume2, VolumeX } from "lucide-react";
import confetti from "canvas-confetti";
import { language } from "./language";

const ASSETS = {
  envelope: "/assets/envelop-sr7wwrnc.png",
  logo: "/assets/logo1-CEx21hqH.png",
  hero: "/assets/mainbg-C1qdEah8.jpg",
  paath: "/assets/pathbithai-mN0HwaUc.png",
  sangeet: "/assets/sanget-Bz6_t-zi.png",
  varmala: "/assets/varmal-C8h79Pnd.png",
  phera: "/assets/phere-LBZBKn6h.png",
  reception: "/assets/recept-CMr8tXBs.jpg",
};

const WEDDING_DATE = new Date(language.weddingDateIso).getTime();
const events = language.eventsSection.events.map((event) => ({
  ...event,
  venue: language.venueName,
  image: ASSETS[event.imageKey],
}));

function getRemainingTime() {
  const diff = Math.max(0, WEDDING_DATE - Date.now());

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function App() {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    document.title = language.meta.title;
  }, []);

  function openInvitation() {
    setOpening(true);
    setTimeout(() => setOpened(true), 900);
  }

  return (
    <div className="app">
      <FloatingPetals />
      {opened && <Butterfly />}
      <BackgroundMusic play={opened || opening} />
      {opened ? <Invitation /> : <EnvelopeIntro onOpen={openInvitation} opening={opening} />}
    </div>
  );
}

function EnvelopeIntro({ onOpen, opening }) {
  return (
    <main className="intro">
      <span className="corner-flower top-left">{language.intro.topDecoration}</span>
      <span className="corner-flower bottom-left">{language.intro.bottomDecoration}</span>
      <button className={`envelope-button ${opening ? "opening" : ""}`} onClick={onOpen} aria-label={language.intro.openAriaLabel}>
        <img src={ASSETS.envelope} alt={language.intro.envelopeAlt} />
        <span className="monogram-wrap">
          <img src={ASSETS.logo} alt={language.intro.monogramAlt} />
        </span>
      </button>
      <h1>{language.intro.heading}</h1>
      <p>{language.intro.instruction}</p>
    </main>
  );
}

function Invitation() {
  const [revealed, setRevealed] = useState(false);

  return (
    <main className="invitation">
      <Hero />
      <section className="section cream">
        <SectionFlourish />
        <div className="section-inner narrow center">
          <Divider />
          <ScratchReveal revealed={revealed} onRevealed={() => setRevealed(true)} />
          <div className={`reveal-content ${revealed ? "visible" : ""}`}>
            <Countdown />
          </div>
        </div>
      </section>
      <section className="section blush">
        <SectionFlourish />
        <div className="section-inner">
          <header className="section-heading">
            <h2>{language.eventsSection.heading}</h2>
            <Divider />
          </header>
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event.title} event={event} />
            ))}
          </div>
        </div>
      </section>
      <section className="section cream center">
        <SectionFlourish />
        <div className="section-inner narrow">
          <h2>{language.presence.heading}</h2>
          <Divider />
          <p className="large-copy">{language.presence.copy}</p>
        </div>
      </section>
      <section className="section blush center">
        <SectionFlourish />
        <div className="section-inner narrow">
          <p className="eyebrow">{language.families.eyebrow}</p>
          <h2>{language.families.heading}</h2>
          <Divider />
          <p className="large-copy">{language.families.copy}</p>
          <div className="family-card">
            <h3>{language.families.title}</h3>
            <Divider small />
            {language.families.names.map((name) => (
              <p key={name}>{name}</p>
            ))}
          </div>
        </div>
      </section>
      <Venue />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="hero">
      <img src={ASSETS.hero} alt={language.hero.imageAlt} />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="blessing">
          {language.hero.blessings.map((blessing) => (
            <p key={blessing}>{blessing}</p>
          ))}
        </div>
        <p>{language.hero.openingLine}</p>
        <p className="bold">{language.hero.hosts}</p>
        <p>
          {language.hero.invitationLine1}
          <br />
          {language.hero.invitationLine2}
        </p>
        <h1>{language.hero.brideName}</h1>
        <p className="family-line">
          {language.hero.brideFamily.map((line, index) => (
            <LineWithBreak key={line} line={line} showBreak={index < language.hero.brideFamily.length - 1} />
          ))}
        </p>
        <p className="with">{language.hero.withText}</p>
        <h1>{language.hero.groomName}</h1>
        <p className="family-line">
          {language.hero.groomFamily.map((line, index) => (
            <LineWithBreak key={line} line={line} showBreak={index < language.hero.groomFamily.length - 1} />
          ))}
        </p>
      </div>
    </section>
  );
}

function LineWithBreak({ line, showBreak }) {
  return (
    <>
      {line}
      {showBreak && <br />}
    </>
  );
}

function ScratchReveal({ revealed, onRevealed }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const scratching = useRef(false);
  const [complete, setComplete] = useState(revealed);

  useEffect(() => {
    if (revealed) {
      setComplete(true);
    }
  }, [revealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || complete) return;

    function paintCover() {
      const rect = wrap.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#f9c8d9");
      gradient.addColorStop(0.5, "#f4a3bf");
      gradient.addColorStop(1, "#e87aa3");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.font = '600 14px "Cinzel", serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(language.scratch.instruction, rect.width / 2, rect.height / 2);
    }

    paintCover();
    window.addEventListener("resize", paintCover);
    return () => window.removeEventListener("resize", paintCover);
  }, [complete]);

  function scratch(clientX, clientY) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(clientX - rect.left, clientY - rect.top, 28, 0, Math.PI * 2);
    ctx.fill();
  }

  function checkProgress() {
    const canvas = canvasRef.current;
    if (!canvas || complete) return;
    const ctx = canvas.getContext("2d");
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    let sampled = 0;

    for (let index = 3; index < pixels.length; index += 160) {
      sampled += 1;
      if (pixels[index] < 60) cleared += 1;
    }

    if (cleared / sampled > 0.45) {
      setComplete(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { x: 0.5, y: 0.4 },
        colors: ["#f9c8d9", "#f4a3bf", "#e87aa3", "#c75a85", "#ffffff"],
      });
      onRevealed();
    }
  }

  return (
    <div ref={wrapRef} className="scratch-card">
      <div className="scratch-date">
        <p>{language.scratch.label}</p>
        <strong>{language.scratch.date}</strong>
      </div>
      {!complete && (
        <canvas
          ref={canvasRef}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            scratching.current = true;
            scratch(event.clientX, event.clientY);
          }}
          onPointerMove={(event) => scratching.current && scratch(event.clientX, event.clientY)}
          onPointerUp={() => {
            scratching.current = false;
            checkProgress();
          }}
          onPointerLeave={() => {
            scratching.current = false;
            checkProgress();
          }}
        />
      )}
    </div>
  );
}

function Countdown() {
  const [remaining, setRemaining] = useState(getRemainingTime);
  const units = useMemo(
    () => [
      [language.countdown.labels.days, remaining.days],
      [language.countdown.labels.hours, remaining.hours],
      [language.countdown.labels.minutes, remaining.minutes],
      [language.countdown.labels.seconds, remaining.seconds],
    ],
    [remaining]
  );

  useEffect(() => {
    const id = window.setInterval(() => setRemaining(getRemainingTime()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="countdown">
      {units.map(([label, value]) => (
        <div className="time-box" key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function EventCard({ event }) {
  return (
    <article className="event-card">
      <img src={event.image} alt="" aria-hidden="true" loading="lazy" />
      <div className="event-overlay" aria-hidden="true" />
      <div className="event-body">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <Divider small />
        <dl>
          <dt>{language.eventsSection.dateLabel}</dt>
          <dd>
            {event.day}
            {language.eventsSection.dateSeparator}
            {event.date}
          </dd>
          <dt>{language.eventsSection.timeLabel}</dt>
          <dd>{event.time}</dd>
          <dt>{language.eventsSection.venueLabel}</dt>
          <dd>{event.venue}</dd>
        </dl>
      </div>
    </article>
  );
}

function Venue() {
  return (
    <section className="section cream center">
      <SectionFlourish />
      <div className="section-inner">
        <p className="eyebrow">{language.venue.eyebrow}</p>
        <h2>{language.venue.heading}</h2>
        <Divider />
        <p className="large-copy">{language.venueName}</p>
        <div className="map-frame">
          <iframe
            title={language.venue.mapTitle}
            src={language.venue.mapEmbedUrl}
            loading="lazy"
          />
        </div>
        <a className="directions-button" href={language.venue.directionsUrl} target="_blank" rel="noreferrer">
          <MapPin size={18} />
          {language.venue.directionsLabel}
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>{language.footer.eyebrow}</p>
      <h2>{language.footer.couple}</h2>
      <Divider />
      <div className="footer-flower">{language.footer.flower}</div>
      <p className="footer-date">{language.footer.date}</p>
      <p>{language.footer.hashtag}</p>
    </footer>
  );
}

function BackgroundMusic({ play }) {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.45;
    audio.loop = true;
    if (play && !muted) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [play, muted]);

  return (
    <>
      <audio ref={audioRef} src={language.audio.src} preload="auto" />
      {play && (
        <button className="music-button" onClick={() => setMuted((value) => !value)} aria-label={muted ? language.audio.unmuteLabel : language.audio.muteLabel}>
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}
    </>
  );
}

function FloatingPetals({ count = 18 }) {
  return (
    <div className="petals">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 12}s`,
            animationDuration: `${14 + Math.random() * 16}s`,
            fontSize: `${14 + Math.random() * 22}px`,
          }}
        >
          {language.decorations.petals[index % language.decorations.petals.length]}
        </span>
      ))}
    </div>
  );
}

function Butterfly() {
  return (
    <div className="butterfly-path" aria-hidden="true">
      <svg className="butterfly-wings" width="38" height="32" viewBox="0 0 64 52" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="32" cy="26" rx="1.6" ry="11" fill="#1f2937" />
        <circle cx="32" cy="14" r="2.2" fill="#1f2937" />
        <path d="M32 13 C 29 8, 27 6, 25 5" stroke="#1f2937" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M32 13 C 35 8, 37 6, 39 5" stroke="#1f2937" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M30 22 C 10 10, 2 22, 6 32 C 10 42, 24 38, 30 30 Z" fill="#3b82f6" opacity="0.95" />
        <path d="M30 30 C 18 38, 10 44, 14 48 C 20 50, 28 42, 30 36 Z" fill="#60a5fa" opacity="0.95" />
        <path d="M34 22 C 54 10, 62 22, 58 32 C 54 42, 40 38, 34 30 Z" fill="#3b82f6" opacity="0.95" />
        <path d="M34 30 C 46 38, 54 44, 50 48 C 44 50, 36 42, 34 36 Z" fill="#60a5fa" opacity="0.95" />
      </svg>
    </div>
  );
}

function Divider({ small = false }) {
  return (
    <div className={`divider ${small ? "small" : ""}`}>
      <span />
      <b>{language.decorations.divider}</b>
      <span />
    </div>
  );
}

function SectionFlourish() {
  return (
    <>
      {language.decorations.flourishes.map((flourish, index) => (
        <span key={`${flourish}-${index}`} className={`flourish f${index + 1}`}>
          {flourish}
        </span>
      ))}
    </>
  );
}

export default App;
