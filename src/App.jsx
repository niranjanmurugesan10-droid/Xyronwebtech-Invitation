
import React, { useEffect, useRef, useState } from "react";
import "./index.css";

import weddingMusic from "./music/invitationsong.mp3";
import invitationImage from "./images/invitation.png";

const WEDDING_DATE = "2026-12-20T09:30:00";

const photos = [
  "/src/images/couple1.png",
  "/src/images/couple2.jpeg",
  "/src/images/couple3.png",
  "/src/images/couple4.png",
  "/src/images/couple5.png",
  "/src/images/couple6.png",
];

/* =========================================================
   COUNTDOWN
========================================================= */

function Countdown() {
  const getTime = () => {
    const diff =
      new Date(WEDDING_DATE).getTime() - Date.now();

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const items = [
    ["days", "நாட்கள்"],
    ["hours", "மணி"],
    ["minutes", "நிமிடம்"],
    ["seconds", "விநாடி"],
  ];

  return (
    <div className="countdown">
      {items.map(([key, label]) => (
        <div className="count-box" key={key}>
          <strong>
            {String(time[key]).padStart(2, "0")}
          </strong>

          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   IMAGE REVEAL
========================================================= */

function RevealImage({ src, direction }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`image-reveal ${direction} ${
        show ? "show" : ""
      }`}
    >
      <div className="image-frame">
        <img
          src={src}
          alt="திருமண நினைவு"
        />
      </div>
    </div>
  );
}

/* =========================================================
   FLOATING DECORATIONS
========================================================= */

function FloatingDecorations() {
  const balloons = [
    {
      left: "7%",
      delay: "0s",
      duration: "14s",
      size: "48px",
    },
    {
      left: "18%",
      delay: "4s",
      duration: "17s",
      size: "38px",
    },
    {
      left: "32%",
      delay: "2s",
      duration: "15s",
      size: "44px",
    },
    {
      left: "49%",
      delay: "6s",
      duration: "18s",
      size: "36px",
    },
    {
      left: "65%",
      delay: "1s",
      duration: "16s",
      size: "46px",
    },
    {
      left: "80%",
      delay: "5s",
      duration: "14s",
      size: "40px",
    },
    {
      left: "92%",
      delay: "8s",
      duration: "19s",
      size: "34px",
    },
  ];

  return (
    <div className="floating-decorations">
      {balloons.map((balloon, index) => (
        <div
          className={`balloon balloon-${
            (index % 3) + 1
          }`}
          key={index}
          style={{
            left: balloon.left,
            animationDelay: balloon.delay,
            animationDuration: balloon.duration,
            "--balloon-size": balloon.size,
          }}
        >
          <div className="balloon-body">
            <span></span>
          </div>

          <div className="balloon-knot"></div>

          <div className="balloon-string"></div>
        </div>
      ))}

      <div className="floating-petal petal-1">
        ✦
      </div>

      <div className="floating-petal petal-2">
        ✧
      </div>

      <div className="floating-petal petal-3">
        ❋
      </div>

      <div className="floating-petal petal-4">
        ✦
      </div>

      <div className="floating-petal petal-5">
        ❋
      </div>
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [doorsOpen, setDoorsOpen] = useState(false);

  const audioRef = useRef(null);

  /* =======================================================
     PLAY WEDDING MUSIC
  ======================================================= */

  const playWeddingMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      audio.volume = 0.45;

      /*
        Start immediately.
        Browser may block autoplay until
        user interacts with the page.
      */

      if (audio.paused) {
        await audio.play();
      }
    } catch (error) {
      console.log(
        "Autoplay blocked by browser:",
        error
      );
    }
  };

  /* =======================================================
     TRY MUSIC IMMEDIATELY ON PAGE LOAD
  ======================================================= */

  useEffect(() => {
    /*
      No setTimeout here.
      Music attempt happens immediately.
    */

    playWeddingMusic();

    /*
      If browser blocks autoplay,
      first user interaction will start music.
    */

    const startMusicOnInteraction = () => {
      playWeddingMusic();
    };

    window.addEventListener(
      "pointerdown",
      startMusicOnInteraction,
      { once: true }
    );

    window.addEventListener(
      "touchstart",
      startMusicOnInteraction,
      { once: true }
    );

    window.addEventListener(
      "keydown",
      startMusicOnInteraction,
      { once: true }
    );

    return () => {
      window.removeEventListener(
        "pointerdown",
        startMusicOnInteraction
      );

      window.removeEventListener(
        "touchstart",
        startMusicOnInteraction
      );

      window.removeEventListener(
        "keydown",
        startMusicOnInteraction
      );
    };
  }, []);

  /* =======================================================
     OPEN INVITATION
  ======================================================= */

  const openInvitation = async () => {
    /*
      User interaction = browser allows audio
    */

    await playWeddingMusic();

    setDoorsOpen(true);

    setTimeout(() => {
      document
        .getElementById("invitation")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 900);
  };

  /* =======================================================
     SHARE WEDDING INVITATION
     
     Mobile:
       Share invitation.png + text + URL

     Fallback:
       Copy URL / WhatsApp
  ======================================================= */

  const shareWedding = async () => {
    const shareUrl = window.location.href;

    const shareText =
      "எங்கள் திருமண அழைப்பிதழை அன்புடன் காண வாருங்கள் ❤️";

    /*
      ================================================
      TRY IMAGE + TEXT SHARING
      ================================================
    */

    try {
      /*
        Fetch invitation image
        and convert it into a File.
      */

      const response = await fetch(invitationImage);

      const blob = await response.blob();

      const imageFile = new File(
        [blob],
        "invitation.png",
        {
          type: blob.type || "image/png",
        }
      );

      /*
        Check whether browser supports
        sharing files.
      */

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [imageFile],
        })
      ) {
        await navigator.share({
          title: "திருமண அழைப்பிதழ்",
          text: shareText,
          url: shareUrl,
          files: [imageFile],
        });

        return;
      }

      /*
        Some browsers support navigator.share
        but not file sharing.
      */

      if (
        navigator.share &&
        typeof navigator.share === "function"
      ) {
        try {
          await navigator.share({
            title: "திருமண அழைப்பிதழ்",
            text: `${shareText}\n${shareUrl}`,
          });

          return;
        } catch (error) {
          if (error?.name === "AbortError") {
            return;
          }
        }
      }
    } catch (error) {
      console.log(
        "Image share unavailable:",
        error
      );
    }

    /*
      ================================================
      WHATSAPP FALLBACK
      ================================================
    */

    try {
      const whatsappText = encodeURIComponent(
        `${shareText}\n\n${shareUrl}`
      );

      const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    } catch (error) {
      console.log(
        "WhatsApp sharing failed:",
        error
      );
    }

    /*
      ================================================
      CLIPBOARD FALLBACK
      ================================================
    */

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          shareUrl
        );

        alert(
          "திருமண அழைப்பிதழ் இணைப்பு நகலெடுக்கப்பட்டது ❤️"
        );

        return;
      }

      /*
        Older browser fallback
      */

      const textarea =
        document.createElement("textarea");

      textarea.value = shareUrl;

      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      document.execCommand("copy");

      document.body.removeChild(textarea);

      alert(
        "திருமண அழைப்பிதழ் இணைப்பு நகலெடுக்கப்பட்டது ❤️"
      );
    } catch (error) {
      console.error(
        "Share failed:",
        error
      );

      alert(
        "இணைப்பை பகிர முடியவில்லை. தயவுசெய்து browser-ல் இருந்து link-ஐ copy செய்யவும்."
      );
    }
  };

  return (
    <main>

      {/* =================================================
          WEDDING MUSIC
      ================================================= */}

      <audio
        ref={audioRef}
        src={weddingMusic}
        loop
        preload="auto"
      />

      {/* =================================================
          DOOR INTRO
      ================================================= */}

      <section
        className={`door-screen ${
          doorsOpen ? "opened" : ""
        }`}
      >

        <FloatingDecorations />

        {/* TOP GARLAND */}

        <div className="top-garland">

          <div className="garland-rope"></div>

          <div className="garland-cluster">
            <i>🌿</i>
            <b>🌼</b>
            <i>🌿</i>
          </div>

          <div className="garland-cluster">
            <i>🌿</i>
            <b>🌸</b>
            <i>🌿</i>
          </div>

          <div className="garland-cluster center-garland">
            <i>🌿</i>
            <b>🌼</b>
            <i>🌿</i>
          </div>

          <div className="garland-cluster">
            <i>🌿</i>
            <b>🌸</b>
            <i>🌿</i>
          </div>

          <div className="garland-cluster">
            <i>🌿</i>
            <b>🌼</b>
            <i>🌿</i>
          </div>

        </div>

        {/* SIDE FLOWERS */}

        <div className="side-flower side-flower-left">
          <span>🌿</span>
          <b>🌼</b>
          <span>🌿</span>
        </div>

        <div className="side-flower side-flower-right">
          <span>🌿</span>
          <b>🌸</b>
          <span>🌿</span>
        </div>

        {/* DOOR */}

        <div className="door-frame">

          {/* INSIDE */}

          <div className="door-inside">

            <div className="inside-floral-corner top-left">
              ❦
            </div>

            <div className="inside-floral-corner top-right">
              ❦
            </div>

            <div className="inside-content">

              <p className="inside-small">
                அன்புடன் அழைக்கிறோம்
              </p>

              <div className="inside-om">
                ௐ
              </div>

              <div className="inside-ornament">
                ✦ ── ❦ ── ✦
              </div>

              <h1>
                திருமண
                <br />
                அழைப்பிதழ்
              </h1>

              <p className="inside-message">
                எங்கள் வாழ்வின் புதிய
                <br />
                அத்தியாயத்திற்கு வருக!
              </p>

              <button
                className="door-cta"
                onClick={openInvitation}
                type="button"
              >
                அழைப்பிதழை காண
              </button>

            </div>

            <div className="inside-floral-corner bottom-left">
              ❦
            </div>

            <div className="inside-floral-corner bottom-right">
              ❦
            </div>

          </div>

          {/* LEFT DOOR */}

          <div className="door door-left">

            <div className="door-panel">

              <div className="door-top-design">
                ❦
              </div>

              <div className="door-middle-design">
                <span>✦</span>
                <span>❖</span>
                <span>✦</span>
              </div>

              <div className="door-knob"></div>

              <div className="door-bottom-design">
                ❦
              </div>

            </div>

          </div>

          {/* RIGHT DOOR */}

          <div className="door door-right">

            <div className="door-panel">

              <div className="door-top-design">
                ❦
              </div>

              <div className="door-middle-design">
                <span>✦</span>
                <span>❖</span>
                <span>✦</span>
              </div>

              <div className="door-knob"></div>

              <div className="door-bottom-design">
                ❦
              </div>

            </div>

          </div>

        </div>

        <p className="door-hint">
          அன்புடன் திறக்கவும்
        </p>

      </section>

      {/* =================================================
          HERO
      ================================================= */}

      <section
        id="invitation"
        className="hero-section"
      >

        <div className="hero-overlay"></div>

        <div className="hero-floral hero-floral-left">
          ❀
        </div>

        <div className="hero-floral hero-floral-right">
          ❀
        </div>

        <div className="hero-content">

          <p className="small-title">
            திருமண அழைப்பிதழ்
          </p>

          <div className="om">
            ௐ
          </div>

          <div className="hero-ornament">
            ✦ ───── ❦ ───── ✦
          </div>

          <h1>
            அருண்
            <span>&</span>
            மீரா
          </h1>

          <p className="hero-description">
            இரு மனங்கள் ஒன்றாகி,
            <br />
            ஓர் அழகான வாழ்க்கையை தொடங்கும்
            <br />
            இனிய தருணத்திற்கு...
          </p>

          <div className="date-line">

            <span>20</span>

            <div>
              <b>டிசம்பர்</b>

              <small>
                ஞாயிற்றுக்கிழமை
              </small>
            </div>

            <span>2026</span>

          </div>

          <p className="venue">
            சென்னை • தமிழ்நாடு
          </p>

        </div>

      </section>

      {/* =================================================
          COUNTDOWN
      ================================================= */}

      <section className="section countdown-section">

        <div className="section-heading">

          <p className="eyebrow">
            எதிர்பார்ப்புடன் காத்திருக்கிறோம்
          </p>

          <h2>
            திருமணத்திற்கு இன்னும்...
          </h2>

          <div className="heading-ornament">
            ❦
          </div>

        </div>

        <Countdown />

        <p className="countdown-note">
          உங்கள் அன்பும் ஆசீர்வாதமும்
          எங்களுடன் இருக்கட்டும்.
        </p>

      </section>

      {/* =================================================
          COUPLE
          
          COUPLE 1 = MEERA
          COUPLE 2 = ARUN
      ================================================= */}

      <section className="section couple-section">

        <div className="section-heading">

          <p className="eyebrow">
            எங்கள் கதை
          </p>

          <h2>
            இரு இதயங்கள் • ஒரு பயணம்
          </h2>

          <div className="heading-ornament">
            ❦
          </div>

        </div>

        <div className="couple-grid">

          {/* COUPLE 1 */}

          <div className="couple-person">

            <RevealImage
              src={photos[0]}
              direction="left"
            />

            <h3 className="couple-name">
              மீரா
            </h3>

          </div>

          {/* CENTER STORY */}

          <div className="couple-text">

            <span className="ornament">
              ❦
            </span>

            <p>
              வாழ்க்கையின் அழகான தருணங்களில்,
              எதிர்பாராத விதமாக சந்தித்த
              இரு மனங்கள்...
            </p>

            <p>
              இன்று ஒருவரின் கையை ஒருவர் பிடித்து,
              வாழ்நாள் முழுவதும் ஒன்றாக பயணிக்க
              தயாராகிறோம்.
            </p>

            <div className="mini-divider">
              ✦
            </div>

          </div>

          {/* COUPLE 2 */}

          <div className="couple-person">

            <RevealImage
              src={photos[1]}
              direction="right"
            />

            <h3 className="couple-name">
              அருண்
            </h3>

          </div>

        </div>

      </section>

      {/* =================================================
          CEREMONY
      ================================================= */}

      <section className="ceremony-section">

        <div className="ceremony-overlay"></div>

        <div className="ceremony-content">

          <p className="eyebrow light">
            மங்களகரமான தருணம்
          </p>

          <div className="ceremony-ornament">
            ❦
          </div>

          <div className="thali-symbol">
            ♢
          </div>

          <h2>
            திருமண முகூர்த்தம்
          </h2>

          <p className="ceremony-description">
            மங்கள நாண் அணிவித்து,
            <br />
            இரு மனங்களையும் ஒரு வாழ்க்கையாக
            <br />
            இணைக்கும் இனிய தருணம்.
          </p>

          <div className="ceremony-date">

            <strong>20</strong>

            <div>

              <span>
                டிசம்பர் 2026
              </span>

              <small>
                காலை 9:30 மணி முதல்
                <br />
                10:30 மணி வரை
              </small>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          EVENTS
      ================================================= */}

      <section className="section events-section">

        <div className="section-heading">

          <p className="eyebrow">
            நிகழ்வுகள்
          </p>

          <h2>
            திருமண நிகழ்ச்சிகள்
          </h2>

          <div className="heading-ornament">
            ❦
          </div>

        </div>

        <div className="events-grid">

          {/* RECEPTION */}

          <article className="event-card">

            <div className="event-flower">
              ❀
            </div>

            <div className="event-icon">
              ❋
            </div>

            <p>
              வரவேற்பு
            </p>

            <h3>
              வரவேற்பு நிகழ்ச்சி
            </h3>

            <span>
              19 டிசம்பர் 2026
            </span>

            <small>
              மாலை 6:30 மணி
            </small>

          </article>

          {/* WEDDING */}

          <article className="event-card featured">

            <div className="event-flower">
              ❀
            </div>

            <div className="event-icon">
              ♢
            </div>

            <p>
              முகூர்த்தம்
            </p>

            <h3>
              திருமணம்
            </h3>

            <span>
              20 டிசம்பர் 2026
            </span>

            <small>
              காலை 9:30 மணி
            </small>

          </article>

          {/* DINNER */}

          <article className="event-card">

            <div className="event-flower">
              ❀
            </div>

            <div className="event-icon">
              ✦
            </div>

            <p>
              அன்புடன்
            </p>

            <h3>
              விருந்துபசாரம்
            </h3>

            <span>
              20 டிசம்பர் 2026
            </span>

            <small>
              மதியம் 12:30 மணி
            </small>

          </article>

        </div>

      </section>

      {/* =================================================
          MEMORIES
          
          ONLY:
          couple3
          couple4
          couple5
          couple6
      ================================================= */}

      <section className="memories-section">

        <div className="section-heading light-heading">

          <p className="eyebrow light">
            எங்கள் நினைவுகள்
          </p>

          <h2>
            சில அழகான தருணங்கள்
          </h2>

          <div className="heading-ornament">
            ❦
          </div>

        </div>

        <div className="memory-list">

          {/* COUPLE 3 */}

          <RevealImage
            src={photos[2]}
            direction="right"
          />

          {/* COUPLE 4 */}

          <RevealImage
            src={photos[3]}
            direction="left"
          />

          {/* COUPLE 5 */}

          <RevealImage
            src={photos[4]}
            direction="right"
          />

          {/* COUPLE 6 */}

          <RevealImage
            src={photos[5]}
            direction="left"
          />

        </div>

      </section>

      {/* =================================================
          FAMILY
      ================================================= */}

      <section className="section family-section">

        <div className="section-heading">

          <p className="eyebrow">
            அன்புடன் அழைப்பவர்கள்
          </p>

          <h2>
            இரு குடும்பங்களின் சார்பாக
          </h2>

          <div className="heading-ornament">
            ❦
          </div>

        </div>

        <div className="family-grid">

          {/* GROOM FAMILY */}

          <div className="family-card">

            <div className="family-flower">
              ❀
            </div>

            <span>
              மணமகன் குடும்பம்
            </span>

            <h3>
              திரு. & திருமதி. அருண்
            </h3>

            <p>
              அன்புடன் பெற்றோர்
              <br />
              மற்றும் உறவினர்கள்
            </p>

          </div>

          {/* BRIDE FAMILY */}

          <div className="family-card">

            <div className="family-flower">
              ❀
            </div>

            <span>
              மணமகள் குடும்பம்
            </span>

            <h3>
              திரு. & திருமதி. மீரா
            </h3>

            <p>
              அன்புடன் பெற்றோர்
              <br />
              மற்றும் உறவினர்கள்
            </p>

          </div>

        </div>

      </section>

      {/* =================================================
          VENUE
      ================================================= */}

      <section className="venue-section">

        <div className="venue-card">

          <div className="venue-flower">
            ❦
          </div>

          <p className="eyebrow light">
            திருமண நடைபெறும் இடம்
          </p>

          <h2>
            ஸ்ரீ திருமண மண்டபம்
          </h2>

          <p className="venue-address">
            123, சென்னை மெயின் ரோடு,
            <br />
            சென்னை, தமிழ்நாடு
          </p>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
          >
            வழிகாட்டியை பார்க்க →
          </a>

        </div>

      </section>

      {/* =================================================
          RSVP / SHARE
      ================================================= */}

      <section className="rsvp-section">

        <div className="rsvp-ornament">
          ✦ ─── ❦ ─── ✦
        </div>

        <p className="eyebrow light">
          உங்கள் வருகை எங்களுக்கு மகிழ்ச்சி
        </p>

        <h2>
          உங்கள் அன்பும் ஆசீர்வாதமும்
        </h2>

        <p className="rsvp-description">
          எங்கள் வாழ்க்கையின் இந்த முக்கியமான
          தருணத்தில்
          <br />
          உங்கள் வருகையை அன்புடன்
          எதிர்பார்க்கிறோம்.
        </p>

        <button
          className="share-btn"
          onClick={shareWedding}
          type="button"
        >
          <span>↗</span>
          அழைப்பிதழை பகிரவும்
        </button>

      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer>

        <div className="footer-flower">
          ❦
        </div>

        <h2>
          அருண் & மீரா
        </h2>

        <p>
          எங்கள் திருமண நாளில்
          <br />
          உங்கள் அன்பும் ஆசீர்வாதமும்
          எங்களுடன் இருக்கட்டும்.
        </p>

        <div className="footer-line"></div>

        <small>
          அன்புடன் • குடும்பத்தினர்
        </small>

      </footer>

    </main>
  );
}

export default App;

