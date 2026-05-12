import { useState, useRef } from "react";

const LOGO_URL = "https://5a432206ab.clvaw-cdnwnd.com/79c345330eb7666ecc4c29a4a2ea684d/200000478-c9021c9023/450/%D0%9F%D0%BB%D0%B0%D0%BA%D0%B0%D1%82%2042x59%20px%203%20%281%29.svg";

const LANGS = {
  cz: {
    tagline: "PRAHA 2 · BĚLEHRADSKÁ 68",
    subtitle: "Váš osobní AI stylový poradce",
    desc: "Nahrajte fotografii a získejte doporučení přímo od naší AI stylistky",
    uploadLabel: "NAHRAJTE FOTOGRAFII",
    uploadHint: "přetáhněte nebo klikněte",
    changePhoto: "KLIKNĚTE PRO ZMĚNU",
    analyzeBtn: "✦ Analyzovat Můj Styl",
    analyzing: "STYLISTKA ANALYZUJE...",
    resultTitle: "ANALÝZA DOKONČENA",
    bookBtn: "REZERVOVAT TERMÍN →",
    bookUrl: "https://noona.app/cs/studiokali",
    errorMsg: "Něco se pokazilo. Zkuste to znovu.",
  },
  ru: {
    tagline: "ПРАГА 2 · БЕЛГРАДСКАЯ 68",
    subtitle: "Ваш личный AI стилист",
    desc: "Загрузите фото и получите рекомендации от нашего AI стилиста",
    uploadLabel: "ЗАГРУЗИТЕ ФОТО",
    uploadHint: "перетащите или нажмите",
    changePhoto: "НАЖМИТЕ ДЛЯ ЗАМЕНЫ",
    analyzeBtn: "✦ Анализировать Стиль",
    analyzing: "СТИЛИСТ АНАЛИЗИРУЕТ...",
    resultTitle: "АНАЛИЗ ЗАВЕРШЁН",
    bookBtn: "ЗАПИСАТЬСЯ →",
    bookUrl: "https://noona.app/cs/studiokali",
    errorMsg: "Что-то пошло не так. Попробуйте снова.",
  },
  en: {
    tagline: "PRAGUE 2 · BĚLEHRADSKÁ 68",
    subtitle: "Your Personal AI Style Advisor",
    desc: "Upload your photo and get recommendations from our AI stylist",
    uploadLabel: "UPLOAD YOUR PHOTO",
    uploadHint: "drag & drop or click",
    changePhoto: "CLICK TO CHANGE",
    analyzeBtn: "✦ Analyze My Style",
    analyzing: "STYLIST IS ANALYZING...",
    resultTitle: "ANALYSIS COMPLETE",
    bookBtn: "BOOK APPOINTMENT →",
    bookUrl: "https://noona.app/cs/studiokali",
    errorMsg: "Something went wrong. Please try again.",
  },
};

const PROMPTS = {
  cz: `Jsi luxusní stylistka Beauty Studio Kali v Praze. Analyzuj fotografii klienta detailně.
Odpověz v češtině, strukturovaně:
**Tvar obličeje:** [typ]
**Současné vlasy:** [popis]
**Doporučené střihy:** [3 návrhy s vysvětlením]
**Doporučené barvy & techniky:** [balayage/airtouch/melíry]
**Čemu se vyhnout:** [2 věci]
**Poznámka stylistky:** [osobní vřelá rada]`,
  ru: `Ты стилист luxury Beauty Studio Kali в Праге. Детально проанализируй фото клиента.
Отвечай на русском:
**Форма лица:** [тип]
**Текущие волосы:** [описание]
**Рекомендуемые стрижки:** [3 варианта]
**Цвета и техники:** [балаяж/airtouch/мелирование]
**Чего избегать:** [2 вещи]
**Заметка стилиста:** [личный теплый совет]`,
  en: `You are a luxury stylist at Beauty Studio Kali in Prague. Analyze the client's photo.
Respond in English:
**Face Shape:** [type]
**Current Hair:** [description]
**Recommended Styles:** [3 suggestions]
**Colors & Techniques:** [balayage/airtouch/highlights]
**What to Avoid:** [2 things]
**Stylist's Note:** [personal warm advice]`,
};

export default function KaliApp() {
  const [lang, setLang] = useState("cz");
  const [photo, setPhoto] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);
  const [photoMime, setPhotoMime] = useState("image/jpeg");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const t = LANGS[lang];

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPhotoMime(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhoto(e.target.result);
      setPhotoBase64(e.target.result.split(",")[1]);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!photoBase64) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: photoMime, data: photoBase64 } },
              { type: "text", text: PROMPTS[lang] }
            ]
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || t.errorMsg;
      setResult(text);
    } catch {
      setResult(t.errorMsg);
    }
    setLoading(false);
  };

  const formatResult = (text) => text.split("\n").map((line, i) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong style='color:#d4af37'>$1</strong>");
    return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} style={{ margin: "4px 0", lineHeight: 1.7 }} />;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#08080b", fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#f0ebe3", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%,100%{opacity:0.3}50%{opacity:1}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(212,175,55,0.2)}50%{box-shadow:0 0 40px rgba(212,175,55,0.5)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .fade-up{animation:fadeUp 0.6s ease forwards}
        .lang-btn{padding:6px 16px;border-radius:20px;border:1px solid #2a2a30;background:transparent;color:#5a5060;cursor:pointer;font-family:'Montserrat',sans-serif;font-size:11px;letter-spacing:2px;transition:all 0.2s}
        .lang-btn.active{border-color:#d4af37;color:#d4af37;background:rgba(212,175,55,0.08)}
        .corner{position:absolute;width:20px;height:20px;border-color:#d4af37;border-style:solid;opacity:0.7}
      `}</style>

      {/* Header */}
      <div style={{ background: "#0d0d10", borderBottom: "1px solid #1a1a20", padding: "28px 24px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: "repeating-linear-gradient(45deg,#d4af37 0,#d4af37 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />

        {/* Logo */}
        <div style={{ animation: "float 4s ease-in-out infinite", marginBottom: 14 }}>
          <img src={LOGO_URL} alt="Studio Kali" style={{ width: 100, height: 100, objectFit: "contain" }} />
        </div>

        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: 4, color: "#d4af37", marginBottom: 10, opacity: 0.8 }}>{t.tagline}</div>
        <div style={{ width: 50, height: 1, background: "linear-gradient(90deg,transparent,#d4af37,transparent)", margin: "0 auto 12px" }} />
        <h1 style={{ fontSize: 20, fontWeight: 300, margin: "0 0 5px", fontStyle: "italic", color: "#c8bfaf" }}>{t.subtitle}</h1>
        <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, color: "#4a4450", letterSpacing: 1, margin: 0 }}>{t.desc}</p>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 0" }}>

        {/* Language switcher */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
          {["cz", "ru", "en"].map(l => (
            <button key={l} className={`lang-btn${lang === l ? " active" : ""}`} onClick={() => { setLang(l); setResult(null); }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Upload label */}
        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: 4, color: "#5a5060", marginBottom: 10, textAlign: "center" }}>{t.uploadLabel}</div>

        {/* Gold border wrapper */}
        <div style={{
          padding: 3,
          background: photo
            ? "linear-gradient(135deg,rgba(212,175,55,0.7),rgba(212,175,55,0.1),rgba(212,175,55,0.7))"
            : "linear-gradient(135deg,rgba(212,175,55,0.2),rgba(212,175,55,0.03),rgba(212,175,55,0.2))",
          borderRadius: 20,
          animation: photo ? "glow 3s ease infinite" : "none",
          marginBottom: 18,
        }}>
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            style={{
              borderRadius: 18, overflow: "hidden",
              background: dragOver ? "rgba(212,175,55,0.05)" : "#0d0d10",
              cursor: "pointer", minHeight: photo ? "auto" : 240,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", transition: "all 0.3s",
            }}
          >
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />

            {photo ? (
              <div style={{ position: "relative", width: "100%" }}>
                <img src={photo} alt="client" style={{ width: "100%", maxHeight: 460, objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(8,8,11,0.7) 0%,transparent 40%)" }} />
                <div className="corner" style={{ top: 12, left: 12, borderWidth: "2px 0 0 2px", borderRadius: "4px 0 0 0" }} />
                <div className="corner" style={{ top: 12, right: 12, borderWidth: "2px 2px 0 0", borderRadius: "0 4px 0 0" }} />
                <div className="corner" style={{ bottom: 12, left: 12, borderWidth: "0 0 2px 2px", borderRadius: "0 0 0 4px" }} />
                <div className="corner" style={{ bottom: 12, right: 12, borderWidth: "0 2px 2px 0", borderRadius: "0 0 4px 0" }} />
                <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center", fontFamily: "'Montserrat',sans-serif", fontSize: 9, letterSpacing: 3, color: "rgba(240,235,227,0.4)" }}>{t.changePhoto}</div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 48 }}>
                <div style={{ width: 64, height: 64, margin: "0 auto 16px", borderRadius: "50%", border: "1px solid rgba(212,175,55,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 24, opacity: 0.25, color: "#d4af37" }}>✦</span>
                </div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11, letterSpacing: 2, color: "#3a3440" }}>{t.uploadHint}</div>
              </div>
            )}
          </div>
        </div>

        {/* Analyze button */}
        {photo && !loading && (
          <button onClick={analyze} className="fade-up" style={{
            width: "100%", padding: "17px", border: "none", borderRadius: 12,
            background: "linear-gradient(135deg,#b8891f,#e8c84a,#b8891f)",
            color: "#08080b", fontFamily: "'Montserrat',sans-serif",
            fontSize: 12, letterSpacing: 3, cursor: "pointer", marginBottom: 20,
            fontWeight: 500, boxShadow: "0 8px 32px rgba(212,175,55,0.3)",
          }}>
            {t.analyzeBtn}
          </button>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "36px 0" }}>
            <div style={{ width: 38, height: 38, border: "1px solid #1a1a20", borderTopColor: "#d4af37", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 18px" }} />
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: 4, color: "#5a5060", animation: "shimmer 1.5s ease infinite" }}>{t.analyzing}</div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="fade-up" style={{ background: "#0d0d10", border: "1px solid #1e1e26", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ background: "linear-gradient(135deg,#16130a,#0d0d10)", borderBottom: "1px solid rgba(212,175,55,0.1)", padding: "15px 22px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#d4af37" }}>✦</span>
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: 3, color: "#d4af37" }}>{t.resultTitle}</span>
            </div>
            <div style={{ padding: "20px 22px", fontSize: 15, lineHeight: 1.8, color: "#c8bfaf", fontWeight: 300 }}>
              {formatResult(result)}
            </div>
            <div style={{ padding: "0 22px 22px" }}>
              <a href={t.bookUrl} target="_blank" rel="noopener noreferrer" style={{
                display: "block", textAlign: "center", padding: "14px",
                background: "linear-gradient(135deg,#b8891f,#e8c84a)",
                color: "#08080b", textDecoration: "none", borderRadius: 10,
                fontFamily: "'Montserrat',sans-serif", fontSize: 11,
                letterSpacing: 3, fontWeight: 500,
                boxShadow: "0 4px 20px rgba(212,175,55,0.25)",
              }}>{t.bookBtn}</a>
            </div>
          </div>
        )}

        {/* Social links */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 20 }}>
          <a href="https://www.instagram.com/kali_hair_beauty_studio/" target="_blank" rel="noopener noreferrer" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:5,textDecoration:"none",color:"#4a4050",fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:1 }}>
            <div style={{ width:44,height:44,borderRadius:"50%",border:"1px solid #2a2a30",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </div>
            Instagram
          </a>
          <a href="https://www.facebook.com/kalihairstudio" target="_blank" rel="noopener noreferrer" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:5,textDecoration:"none",color:"#4a4050",fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:1 }}>
            <div style={{ width:44,height:44,borderRadius:"50%",border:"1px solid #2a2a30",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </div>
            Facebook
          </a>
          <a href="https://www.youtube.com/@studiokali" target="_blank" rel="noopener noreferrer" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:5,textDecoration:"none",color:"#4a4050",fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:1 }}>
            <div style={{ width:44,height:44,borderRadius:"50%",border:"1px solid #2a2a30",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </div>
            YouTube
          </a>
          <a href="https://www.tiktok.com/@beautystudiokali" target="_blank" rel="noopener noreferrer" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:5,textDecoration:"none",color:"#4a4050",fontFamily:"'Montserrat',sans-serif",fontSize:9,letterSpacing:1 }}>
            <div style={{ width:44,height:44,borderRadius:"50%",border:"1px solid #2a2a30",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
            </div>
            TikTok
          </a>
        </div>

        <div style={{ textAlign: "center", fontFamily: "'Montserrat',sans-serif", fontSize: 10, letterSpacing: 2, color: "#1e1e26", paddingTop: 8 }}>
          ✦ STUDIO KALI · PRAHA 2 ✦
        </div>
      </div>
    </div>
  );
}
