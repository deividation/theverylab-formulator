import React, { useState, useRef } from "react";

const C = {
  red: "#9F132D",
  cream: "#FBF8EE",
  pink: "#F6D4D8",
  pinkMid: "#E26372",
  black: "#000000",
  white: "#FFFFFF",
};

const PRICE_TIERS = [
  { qty: 500,   price: 5.50, label: "500 units" },
  { qty: 1000,  price: 5.10, label: "1 000 units" },
  { qty: 2000,  price: 4.75, label: "2 000 units" },
  { qty: 3000,  price: 4.45, label: "3 000 units", popular: true },
  { qty: 5000,  price: 4.10, label: "5 000 units" },
  { qty: 10000, price: 3.70, label: "10 000 units" },
];

const getPrice = (qty) => {
  let t = PRICE_TIERS[0];
  for (const tier of PRICE_TIERS) { if (qty >= tier.qty) t = tier; }
  return t.price;
};

const CATS = [
  { id: "women",     label: "Women",       sub: "Face & body care",            icon: "✧" },
  { id: "men",       label: "Men",         sub: "Shaving, beard & hair",       icon: "✻" },
  { id: "pets",      label: "Pets",        sub: "Dogs, cats & more",           icon: "✦" },
  { id: "fragrance", label: "Fragrance",   sub: "EDP, EDT, body mist & more",  icon: "✿" },
  { id: "home",      label: "Home scents", sub: "Candles, diffusers, sprays",  icon: "⬡" },
];

const PRODUCTS = {
  women:     ["Serum","Face cream","Toner","Face oil","Mask","Eye cream","Body lotion","Body butter","Hand cream","Lip balm"],
  men:       ["Shaving foam","Shaving gel","After-shave balm","Beard oil","Beard balm","Beard shampoo","Beard wax","Face cream","Body lotion","Shampoo","Conditioner","Hair serum","Hair wax","Hair paste","Hair gel","Pomade"],
  pets:      ["Dog shampoo","Cat shampoo","Conditioner","Coat oil","Paw cream","Deodorant"],
  fragrance: ["Eau de Parfum","Eau de Toilette","Body mist","Hair mist","Scented body oil","Solid perfume","Car fragrance"],
  home:      ["Candle","Reed diffuser","Room spray","Linen spray","Wax melt","Scent stone","Incense"],
};

const AVOID_OPTS = ["Parabens","Silicones","Mineral oil","Alcohol","Artificial fragrances","Sulphates","PEG compounds","Synthetic dyes"];

const skinCtx = (cat, type) => {
  if (!type) return { label: "Skin type", options: [], effects: [] };
  if (cat === "fragrance" || cat === "home") return {
    label: "Scent family", skip: true,
    options: ["Floral","Woody","Citrus","Oriental","Aquatic"],
    effects: ["Long-lasting","Freshness","Intensity","Subtlety","Relaxation"],
  };
  const hairKeys = ["shaving","beard","shampoo","conditioner","hair","pomade"];
  if (hairKeys.some(h => type.toLowerCase().includes(h))) return {
    label: "Hair type", skip: true,
    options: ["Fine","Thick","Straight","Wavy","Oily","Dry"],
    effects: ["Strong hold","Moisturizing","Shine","Softening","Volume"],
  };
  const map = {
    women: { label:"Skin type", options:["Dry","Oily","Combination","Sensitive","Normal","Mature"], effects:["Moisturizing","Anti-aging","Brightening","Soothing","Pore minimizing","Firming","Protection"] },
    men:   { label:"Skin type", options:["Normal","Dry","Oily","Sensitive"], effects:["Moisturizing","Soothing","Anti-age","Firming","Protection"] },
    pets:  { label:"Coat type", options:["Normal","Sensitive","Dry","Oily"], effects:["Moisturizing","Shine","Odor removal","Soothing","Coat strengthening"] },
  };
  return map[cat] || map.women;
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:${C.cream};font-family:'Afacad',sans-serif;color:${C.black}}
  input,textarea{font-family:'Afacad',sans-serif;font-size:0.9rem;outline:none;background:${C.white};color:${C.black};width:100%;border:1.5px solid rgba(0,0,0,0.12);padding:0.7rem 1rem;transition:border-color 0.15s}
  input:focus,textarea:focus{border-color:${C.red}}
  textarea{resize:vertical;line-height:1.6}
  .chip{cursor:pointer;padding:0.45rem 1rem;border:1.5px solid rgba(0,0,0,0.15);background:transparent;color:${C.black};font-family:'Afacad',sans-serif;font-size:0.88rem;transition:all 0.18s}
  .chip:hover{border-color:${C.red};color:${C.red}}
  .chip.sel{border-color:${C.red};background:${C.red};color:${C.white}}
  .chip.dim{opacity:0.25;cursor:not-allowed}
  .btn{border:none;padding:0.9rem 2.8rem;font-family:'Afacad',sans-serif;font-size:0.88rem;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:all 0.2s;font-weight:600;background:${C.red};color:${C.white}}
  .btn:hover:not(:disabled){background:#7d0f24}
  .btn:disabled{opacity:0.35;cursor:not-allowed}
  .btn.ghost{background:transparent;color:${C.red};border:1.5px solid ${C.red};padding:0.9rem 2rem;font-weight:500}
  .btn.ghost:hover{background:${C.red};color:${C.white}}
  .btn.dark{background:${C.black};color:${C.white}}
  .btn.dark:hover:not(:disabled){background:#222}
  .fade{animation:fi 0.25s ease}
  @keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .bar{height:2px;background:rgba(0,0,0,0.08)}
  .fill{height:2px;background:${C.red};transition:width 0.4s}
  .catcard{cursor:pointer;border:1.5px solid rgba(0,0,0,0.1);padding:1.5rem 1.3rem;background:${C.white};transition:all 0.2s;text-align:left}
  .catcard:hover{border-color:${C.red};transform:translateY(-2px)}
  .catcard.sel{border-color:${C.red};background:${C.pink}}
  .sk{background:linear-gradient(90deg,rgba(159,19,45,0.04) 0%,rgba(159,19,45,0.1) 50%,rgba(159,19,45,0.04) 100%);background-size:200% 100%;animation:sk 1.5s infinite;margin-bottom:0.7rem}
  @keyframes sk{0%{background-position:-200% 0}100%{background-position:200% 0}}
  .nav{background:${C.white};border-bottom:1px solid rgba(0,0,0,0.07);padding:0 1.5rem;height:52px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
  .result-header{background:${C.red};color:${C.white};padding:2rem}
  .result-body{background:${C.white};border:1.5px solid rgba(0,0,0,0.08);padding:1.8rem;font-size:0.9rem;line-height:1.7}
  .panel{background:${C.white};border:1.5px solid rgba(0,0,0,0.08)}
  .panel-header{padding:1.5rem 2rem}
  .panel-body{padding:1.8rem}
  .tag{display:inline-block;padding:0.15rem 0.55rem;font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;font-weight:700}
`;

// ─── SAMPLE REQUEST ───────────────────────────────────────────────────────────
function SampleRequest({ pricing, form, catLabel, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) return (
    <div className="panel fade">
      <div className="panel-header" style={{ background: C.red, color: C.white }}>
        <div style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.6, marginBottom: "0.4rem" }}>the very lab</div>
        <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>🧪 Sample request</div>
      </div>
      <div className="panel-body" style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✓</div>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: C.red, marginBottom: "0.5rem" }}>Request sent!</div>
        <div style={{ fontSize: "0.88rem", opacity: 0.6, marginBottom: "2rem" }}>We'll be in touch within 24 hours.</div>
        <button className="btn ghost" onClick={onClose}>← Back to results</button>
      </div>
    </div>
  );

  return (
    <div className="panel fade">
      <div className="panel-header" style={{ background: C.red, color: C.white }}>
        <div style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.6, marginBottom: "0.4rem" }}>the very lab</div>
        <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>🧪 Order a sample</div>
      </div>
      <div className="panel-body">
        <p style={{ fontSize: "0.88rem", lineHeight: 1.65, marginBottom: "1rem", opacity: 0.7 }}>
          Get a 50ml sample of your formulation before committing to a full batch. Delivery within 5–7 business days.
        </p>
        <div style={{ background: C.pink, borderLeft: `3px solid ${C.red}`, padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.85rem", fontWeight: 600 }}>
          Sample price: €35 — credited towards your first production order.
        </div>

        {/* Formula summary */}
        {form.types?.length > 0 && (
          <div style={{ background: C.cream, padding: "0.9rem 1rem", marginBottom: "1.5rem", fontSize: "0.82rem", lineHeight: 1.8 }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.red, fontWeight: 700, marginBottom: "0.3rem" }}>Your formula</div>
            <div><strong>{catLabel}</strong> · {form.types.join(", ")}</div>
            {form.effects.length > 0 && <div style={{ opacity: 0.65 }}>{form.effects.join(", ")}</div>}
            {pricing.qty > 0 && <div style={{ color: C.red, fontWeight: 700, marginTop: "0.3rem" }}>Planned batch: {pricing.qty.toLocaleString()} units · ~€{pricing.total?.toLocaleString()}</div>}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Full name *", val: name, set: setName, type: "text", ph: "Jane Smith" },
            { label: "Email *", val: email, set: setEmail, type: "email", ph: "jane@yourbrand.com" },
            { label: "Company / brand", val: company, set: setCompany, type: "text", ph: "Your Brand Ltd." },
          ].map(({ label, val, set, type, ph }) => (
            <div key={label}>
              <div style={{ fontSize: "0.7rem", opacity: 0.5, marginBottom: "0.35rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
              <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph} />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={() => setSent(true)} disabled={!name || !email}>Submit request</button>
        </div>
      </div>
    </div>

  );
}

// ─── WAITLIST ─────────────────────────────────────────────────────────────────
// ─── PROJECT TRACKER ─────────────────────────────────────────────────────────
const DEMO_PROJECTS = {
  "demo@theverylab.com": {
    id: "TVL-2024-047",
    product: "Beard Balm — Nordic Series",
    brand: "Northwood Grooming",
    startDate: "2024-11-12",
    stages: [
      { id: "consultation", label: "Consultation", icon: "◎", status: "done", date: "Nov 12", note: "Formula brief confirmed. Nordic pine + cedar scent direction." },
      { id: "formula",      label: "Formulation",  icon: "⬡", status: "done", date: "Nov 19", note: "R&D completed. EU compliance verified. pH 6.2." },
      { id: "sampling",     label: "Sampling",     icon: "◈", status: "done", date: "Nov 28", note: "50ml sample shipped. Awaiting client approval." },
      { id: "approval",     label: "Approval",     icon: "◉", status: "active", date: "Dec 03", note: "Sample under review. Please confirm by Dec 10." },
      { id: "production",   label: "Production",   icon: "⬟", status: "pending", date: "~Dec 16", note: "3 000 units scheduled. Est. 8 working days." },
      { id: "qc",           label: "QC & Testing", icon: "◇", status: "pending", date: "~Dec 26", note: "Full batch quality control + documentation." },
      { id: "delivery",     label: "Delivery",     icon: "◻", status: "pending", date: "~Jan 03", note: "Shipping to Vilnius warehouse. DPD Express." },
    ],
  },
  "test@brand.com": {
    id: "TVL-2024-052",
    product: "Face Serum — Vitamin C Complex",
    brand: "Lumera Beauty",
    startDate: "2024-12-01",
    stages: [
      { id: "consultation", label: "Consultation", icon: "◎", status: "done",   date: "Dec 01", note: "Brief confirmed. Brightening + anti-age direction." },
      { id: "formula",      label: "Formulation",  icon: "⬡", status: "active", date: "Dec 10", note: "R&D in progress. Niacinamide 5% + Vit C 3% formula." },
      { id: "sampling",     label: "Sampling",     icon: "◈", status: "pending", date: "~Dec 20", note: "50ml sample will be shipped after formula lock." },
      { id: "approval",     label: "Approval",     icon: "◉", status: "pending", date: "~Dec 27", note: "Client review period: 5 business days." },
      { id: "production",   label: "Production",   icon: "⬟", status: "pending", date: "~Jan 10", note: "1 000 units batch." },
      { id: "qc",           label: "QC & Testing", icon: "◇", status: "pending", date: "~Jan 17", note: "Full quality control." },
      { id: "delivery",     label: "Delivery",     icon: "◻", status: "pending", date: "~Jan 22", note: "Shipping to client warehouse." },
    ],
  },
};

function ProjectTracker({ onClose }) {
  const [email, setEmail] = useState("");
  const [project, setProject] = useState(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySent, setNotifySent] = useState(false);
  const [notifyStages, setNotifyStages] = useState({ all: true });
  const [view, setView] = useState("lookup"); // lookup | tracker | notify

  const lookup = () => {
    const found = DEMO_PROJECTS[email.toLowerCase().trim()];
    if (found) { setProject(found); setView("tracker"); }
    else setProject(null);
  };

  const activeIdx = project ? project.stages.findIndex(s => s.status === "active") : -1;
  const doneCount = project ? project.stages.filter(s => s.status === "done").length : 0;
  const totalStages = project ? project.stages.length : 0;
  const pct = project ? Math.round((doneCount / totalStages) * 100) : 0;

  const statusStyle = (status) => {
    if (status === "done")    return { color: "#16a34a", bg: "rgba(22,163,74,0.08)", border: "rgba(22,163,74,0.25)" };
    if (status === "active")  return { color: C.red,    bg: C.pink,                 border: C.red };
    return { color: "rgba(0,0,0,0.3)", bg: "transparent", border: "rgba(0,0,0,0.1)" };
  };

  if (view === "notify") return (
    <div className="panel fade">
      <div className="panel-header" style={{ background: C.black, color: C.white }}>
        <div style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.5, marginBottom: "0.4rem" }}>the very lab / {project?.id}</div>
        <div style={{ fontSize: "1.3rem", fontWeight: 700 }}>🔔 Status notifications</div>
      </div>
      <div className="panel-body">
        {notifySent ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✓</div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>Notifications enabled!</div>
            <div style={{ fontSize: "0.85rem", opacity: 0.6, marginBottom: "2rem" }}>
              We'll email <strong>{notifyEmail}</strong> when your project moves to the next stage.
            </div>
            <button className="btn ghost" onClick={() => setView("tracker")}>← Back to project</button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1.5rem", opacity: 0.7 }}>
              Get an email notification every time your project advances to the next production stage.
            </p>
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.7rem", opacity: 0.5, marginBottom: "0.35rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Notify email</div>
              <input type="email" value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)} placeholder="hello@yourbrand.com" />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.7rem", opacity: 0.5, marginBottom: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Notify me when stage changes to:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {project?.stages.filter(s => s.status !== "done").map(s => (
                  <label key={s.id} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.88rem", cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: C.red, width: "14px", height: "14px" }} />
                    <span style={{ opacity: s.status === "active" ? 1 : 0.6 }}>{s.icon} {s.label}</span>
                    {s.status === "active" && <span style={{ fontSize: "0.65rem", background: C.red, color: C.white, padding: "0.1rem 0.4rem", letterSpacing: "0.08em" }}>ACTIVE</span>}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn ghost" onClick={() => setView("tracker")}>Cancel</button>
              <button className="btn" disabled={!notifyEmail} onClick={() => setNotifySent(true)}>Enable notifications</button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (view === "tracker" && project) return (
    <div className="panel fade">
      <div className="panel-header" style={{ background: C.black, color: C.white }}>
        <div style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.5, marginBottom: "0.4rem" }}>the very lab / production tracker</div>
        <div style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.3rem" }}>{project.product}</div>
        <div style={{ fontSize: "0.78rem", opacity: 0.55 }}>{project.brand} · {project.id}</div>
      </div>

      {/* Progress bar */}
      <div style={{ height: "4px", background: "rgba(255,255,255,0.12)", position: "relative" }}>
        <div style={{ height: "4px", background: C.pinkMid, width: pct + "%", transition: "width 0.6s" }} />
      </div>

      <div className="panel-body">
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem", marginBottom: "1.8rem" }}>
          {[
            { label: "Progress",       value: pct + "%"       },
            { label: "Stages done",    value: `${doneCount} / ${totalStages}` },
            { label: "Current stage",  value: activeIdx >= 0 ? project.stages[activeIdx].label : "Complete" },
          ].map(({ label, value }) => (
            <div key={label} style={{ border: "1.5px solid rgba(0,0,0,0.08)", padding: "0.8rem", textAlign: "center" }}>
              <div style={{ fontSize: "0.58rem", opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.3rem" }}>{label}</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Stage roadmap */}
        <div style={{ position: "relative", marginBottom: "1.8rem" }}>
          {project.stages.map((stage, i) => {
            const s = statusStyle(stage.status);
            const isLast = i === project.stages.length - 1;
            return (
              <div key={stage.id} style={{ display: "flex", gap: "0", marginBottom: isLast ? 0 : "0" }}>
                {/* Line + icon column */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "36px", flexShrink: 0 }}>
                  <div style={{
                    width: "28px", height: "28px", border: `2px solid ${s.border}`,
                    background: s.bg, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", color: s.color, fontWeight: 700, flexShrink: 0,
                    boxShadow: stage.status === "active" ? `0 0 0 3px ${C.pink}` : "none",
                  }}>
                    {stage.status === "done" ? "✓" : stage.icon}
                  </div>
                  {!isLast && <div style={{ width: "2px", flex: 1, minHeight: "16px", background: stage.status === "done" ? "rgba(22,163,74,0.3)" : "rgba(0,0,0,0.08)" }} />}
                </div>

                {/* Content */}
                <div style={{ paddingLeft: "0.8rem", paddingBottom: isLast ? 0 : "1.2rem", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: stage.status === "active" ? 700 : 500, color: stage.status === "pending" ? "rgba(0,0,0,0.35)" : C.black }}>
                      {stage.label}
                    </div>
                    {stage.status === "active" && (
                      <div style={{ fontSize: "0.6rem", background: C.red, color: C.white, padding: "0.1rem 0.4rem", letterSpacing: "0.1em", fontWeight: 700 }}>ACTIVE</div>
                    )}
                    <div style={{ marginLeft: "auto", fontSize: "0.72rem", opacity: 0.4, whiteSpace: "nowrap" }}>{stage.date}</div>
                  </div>
                  <div style={{ fontSize: "0.78rem", opacity: stage.status === "pending" ? 0.35 : 0.6, lineHeight: 1.5 }}>{stage.note}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button className="btn ghost" onClick={() => setView("lookup")}>← Look up another</button>
          <button className="btn dark" onClick={() => setView("notify")}>🔔 Get notified</button>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );

  // Lookup view
  return (
    <div className="panel fade">
      <div className="panel-header" style={{ background: C.black, color: C.white }}>
        <div style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.5, marginBottom: "0.4rem" }}>the very lab</div>
        <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>⬟ Production tracker</div>
      </div>
      <div className="panel-body">
        <p style={{ fontSize: "0.88rem", lineHeight: 1.65, marginBottom: "1.5rem", opacity: 0.7 }}>
          Enter the email you used when placing your order to track your production status in real time.
        </p>

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.7rem", opacity: 0.5, marginBottom: "0.35rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Your order email</div>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && lookup()}
              placeholder="hello@yourbrand.com" />
            <button className="btn" onClick={lookup} disabled={!email} style={{ whiteSpace: "nowrap", padding: "0.7rem 1.5rem" }}>
              Track →
            </button>
          </div>
          {email && project === null && (
            <div style={{ marginTop: "0.6rem", fontSize: "0.78rem", color: C.red, opacity: 0.8 }}>
              No active project found for this email.
            </div>
          )}
        </div>

        <div style={{ background: C.cream, padding: "0.8rem 1rem", fontSize: "0.78rem", opacity: 0.6, marginBottom: "1.5rem" }}>
          💡 Try <strong>demo@theverylab.com</strong> or <strong>test@brand.com</strong> to see a live example.
        </div>

        <button className="btn ghost" onClick={onClose} style={{ width: "100%" }}>Cancel</button>
      </div>
    </div>
  );
}

// ─── EARNINGS CALCULATOR ──────────────────────────────────────────────────────
function EarningsCalc({ costPerUnit, qty, typesCount = 1 }) {
  const [sellPrice, setSellPrice] = useState(0);
  const [segIdx, setSegIdx] = useState(1);
  const n = Math.max(1, typesCount);

  const segs = [
    { label: "Mass market / FMCG",  range: "€15–18",  margin: "~€6–9/unit"  },
    { label: "Mid-range segment",   range: "€20–30",  margin: "~€11–21/unit" },
    { label: "Premium line",        range: "€35–50",  margin: "~€26–41/unit" },
    { label: "High-end segment",    range: "€55–75",  margin: "~€46–66/unit" },
    { label: "Luxury / Niche",      range: "€80–100+",margin: "~€71–91+/unit" },
  ];

  const profit = sellPrice > 0 ? (sellPrice - costPerUnit).toFixed(2) : null;
  const margin = sellPrice > 0 ? Math.round(((sellPrice - costPerUnit) / sellPrice) * 100) : null;
  const revenuePerProduct = sellPrice > 0 && qty > 0 ? Math.round(sellPrice * qty) : null;
  const netProfitPerProduct = sellPrice > 0 && qty > 0 ? Math.round((sellPrice - costPerUnit) * qty) : null;
  const revenueTotal = revenuePerProduct ? revenuePerProduct * n : null;
  const netProfitTotal = netProfitPerProduct ? netProfitPerProduct * n : null;
  const breakEven = sellPrice > 0 && costPerUnit > 0 ? Math.ceil((costPerUnit * (qty || 500)) / (sellPrice - costPerUnit)) : null;

  return (
    <div style={{ marginTop: "2rem" }}>
      <div style={{ fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: C.red, fontWeight: 600, marginBottom: "1.2rem" }}>Earnings calculator</div>

      <div style={{ marginBottom: "1.2rem" }}>
        <div style={{ fontSize: "0.7rem", opacity: 0.45, marginBottom: "0.6rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>Market segment</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {segs.map((s, i) => (
            <button key={i} className={"chip" + (segIdx === i ? " sel" : "")} onClick={() => setSegIdx(i)} style={{ fontSize: "0.78rem" }}>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.6rem", fontSize: "0.78rem", opacity: 0.55 }}>
          Typical retail price: <strong>{segs[segIdx].range}</strong> · Typical margin: <strong>{segs[segIdx].margin}</strong>
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.7rem", opacity: 0.45, marginBottom: "0.35rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>Your selling price per unit (€)</div>
        <input type="number" min="0" step="0.5" placeholder="e.g. 29.90"
          value={sellPrice || ""} onChange={e => setSellPrice(parseFloat(e.target.value) || 0)}
          style={{ maxWidth: "200px" }} />
      </div>

      {profit !== null && costPerUnit > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.8rem" }}>
            {[
              { label: "Profit / unit", value: `€${profit}`, highlight: parseFloat(profit) > 0 },
              { label: "Margin", value: `${margin}%`, highlight: margin > 0 },
              { label: n > 1 ? "Revenue / product" : "Total revenue", value: revenuePerProduct ? `~€${revenuePerProduct.toLocaleString()}` : "—" },
              { label: n > 1 ? "Net profit / product" : "Net profit", value: netProfitPerProduct ? `~€${netProfitPerProduct.toLocaleString()}` : "—", highlight: netProfitPerProduct > 0 },
            ].map(({ label, value, highlight }) => (
              <div key={label} style={{ border: `1.5px solid rgba(0,0,0,0.08)`, padding: "0.9rem 1rem", background: C.white }}>
                <div style={{ fontSize: "0.6rem", opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>{label}</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: highlight ? C.red : C.black }}>{value}</div>
              </div>
            ))}
          </div>
          {n > 1 && revenueTotal && (
            <div style={{ marginTop: "0.8rem", background: C.pink, borderLeft: `3px solid ${C.red}`, padding: "0.8rem 1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <div>
                <div style={{ fontSize: "0.6rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>Full line revenue ({n} products)</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>~€{revenueTotal.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.6rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>Full line net profit</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: C.red }}>~€{netProfitTotal?.toLocaleString()}</div>
              </div>
            </div>
          )}
        </>
      )}
      {breakEven !== null && breakEven > 0 && (
        <div style={{ marginTop: "0.8rem", fontSize: "0.78rem", opacity: 0.5 }}>
          Break-even: sell <strong>{breakEven.toLocaleString()} units</strong> to recover your full investment.
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ cat: "", types: [], skin: [], effects: [], avoid: [], brief: "" });
  const [pricing, setPricing] = useState({ qty: 0, pricePerUnit: 0, total: 0 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadDone, setLeadDone] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const topRef = useRef(null);

  const toggle = (field, val) => setForm(f => ({
    ...f, [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val]
  }));

  const selectCat = (id) => {
    setForm(f => ({ ...f, cat: id, types: [], skin: [], effects: [] }));
    setTimeout(() => setStep(1), 180);
  };

  const canNext = () => {
    if (step === 1) return form.types.length > 0;
    if (step === 2) return form.skin.length > 0;
    if (step === 3) return form.effects.length > 0;
    return true;
  };

  const catLabel = () => (CATS.find(x => x.id === form.cat) || {}).label || "";
  const pct = step === 0 ? 0 : step >= 8 ? 100 : ((step - 1) / 7) * 100;
  const ctx = skinCtx(form.cat, form.types[0] || "");

  const STEP_LABELS = ["", "Product type", ctx.label, "Effects", "Ingredients", "Quantity & price", "Packaging (EVC)", "Additional info"];

const submit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const prompt = `You are a professional cosmetics formulator at a private label laboratory. Create a detailed formulation direction for each product below.

CLIENT BRIEF:
- Category: ${catLabel()}
- Products: ${form.types.join(", ")}
- Skin/hair type: ${form.skin.join(", ") || "not specified"}
- Desired effects: ${form.effects.join(", ") || "not specified"}
- Ingredients to avoid: ${form.avoid.length > 0 ? form.avoid.join(", ") : "none"}
- Additional notes: ${form.brief || "none"}

For EACH product, provide a separate section in this exact format:

--- [PRODUCT NAME IN CAPS] ---
ACTIVE INGREDIENTS
- [ingredient name] [%] — [function]
(list 4-6 key actives tailored to the skin type and desired effects)

BASE FORMULA
[Full INCI list, comma separated, realistic for this product type]

TEXTURE & SENSORY
[2 sentences describing texture, finish, and sensory experience]

REGULATORY NOTES
[EU compliance note, pH range, shelf life, preservation system]

Be specific, professional, and realistic. Concentrations must be scientifically accurate. Adapt each formula to the specified skin type and effects.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY || "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",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`API error ${response.status}: ${JSON.stringify(data).substring(0, 200)}`);
      }
      const text = data.content?.map(b => b.text || "").join("").trim() || "Error: empty response from AI. Raw: " + JSON.stringify(data).substring(0, 300);

      const header = `FORMULATION DIRECTION\n${catLabel()} product line — ${form.types.length} product${form.types.length > 1 ? "s" : ""}\nSkin: ${form.skin.join(", ")} | Effects: ${form.effects.join(", ")}${form.avoid.length > 0 ? " | Avoid: " + form.avoid.join(", ") : ""}`;
      setResult(header + "\n\n" + text);
    } catch (err) {
      setResult("FORMULATION ERROR\nCould not connect to the formulation engine. Please try again.\n\nError: " + err.message);
    }

    setLoading(false);
    setStep(8);
    setShowSample(false);
    setShowWaitlist(false);
  };

  const reset = () => {
    setStep(0);
    setForm({ cat: "", types: [], skin: [], effects: [], avoid: [], brief: "" });
    setPricing({ qty: 0, pricePerUnit: 0, total: 0 });
    setResult(null);
    setShowSample(false);
    setShowWaitlist(false);
    topRef.current?.scrollIntoView();
  };

  const renderResult = (txt) => txt.split("\n").map((line, i) => {
    const c = line.trim();
    if (!c) return <br key={i} />;
    if (c.startsWith("--- ") && c.endsWith(" ---")) return (
      <div key={i} style={{ background: C.black, color: C.white, padding: "0.4rem 1rem", marginTop: "1.8rem", marginBottom: "0.8rem", fontSize: "0.72rem", letterSpacing: "0.15em", fontWeight: 700 }}>{c.replace(/---/g, "").trim()}</div>
    );
    const isH = ["FORMULATION","ACTIVE","BASE","REGULATORY","TEXTURE","CONCENTRATION","UNIQUENESS","PRESERVATION"].some(h => c.startsWith(h));
    if (isH) return <div key={i} style={{ color: C.red, fontWeight: 700, marginTop: "1rem", marginBottom: "0.3rem", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{c}</div>;
    if (c.startsWith("- ")) return <div key={i} style={{ paddingLeft: "1rem", marginBottom: "0.25rem", opacity: 0.85, lineHeight: 1.65 }}>{c}</div>;
    return <div key={i} style={{ marginBottom: "0.25rem", opacity: 0.75, lineHeight: 1.7 }}>{c}</div>;
  });

  const costPerUnit = pricing.pricePerUnit;

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "'Afacad',sans-serif", color: C.black }} ref={topRef}>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <div style={{ fontWeight: 600, fontSize: "1rem", letterSpacing: "0.02em" }}>the very lab</div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "#f59e0b", color: "#000", padding: "0.2rem 0.6rem", fontWeight: 700 }}>DEMO</div>
          {step > 0 && step < 8 && (
            <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: C.red, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Afacad',sans-serif", fontWeight: 500 }}>
              restart
            </button>
          )}
        </div>
      </nav>

      {/* HERO */}
      {step === 0 && (
        <>
          <div style={{ background: C.red, padding: "4.5rem 2rem 4rem", textAlign: "center" }}>
            <div style={{ maxWidth: "620px", margin: "0 auto" }}>
              <p style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "1.2rem" }}>Private Label Cosmetics Laboratory</p>
              <h1 style={{ fontFamily: "'Afacad',sans-serif", fontSize: "clamp(2.4rem,6vw,3.8rem)", fontWeight: 700, color: C.white, lineHeight: 1.08, marginBottom: "1.4rem", letterSpacing: "-0.02em" }}>
                Your formula.<br />Our laboratory.
              </h1>
              <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.65, maxWidth: "440px", margin: "0 auto 2rem" }}>
                Build your cosmetics brand with a professional private label laboratory. From concept to finished product.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                {[{n:"500+",t:"Formulas created"},{n:"EU",t:"Regulatory compliant"},{n:"24 mo",t:"Product shelf life"}].map((s,i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Afacad',sans-serif", fontSize: "1.6rem", fontWeight: 700, color: C.white, lineHeight: 1 }}>{s.n}</div>
                    <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "0.3rem" }}>{s.t}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ background: C.black, color: C.white, padding: "1.1rem 2rem" }}>
            <div style={{ maxWidth: "660px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
              {["✓ MOQ from 500 units","✓ Eurovétrocap packaging","✓ CPNP notification","✓ Fast prototyping"].map((s,i) => (
                <span key={i} style={{ fontSize: "0.75rem", letterSpacing: "0.05em", opacity: 0.8 }}>{s}</span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MAIN */}
      <div style={{ maxWidth: "660px", margin: "0 auto", padding: step === 0 ? "3rem 1.5rem 5rem" : "2.5rem 1.5rem 5rem" }}>

        {/* Progress */}
        {step >= 1 && step < 8 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.red, fontWeight: 600 }}>{STEP_LABELS[step]}</div>
              <div style={{ fontSize: "0.7rem", opacity: 0.35 }}>{step} / 7</div>
            </div>
            <div className="bar"><div className="fill" style={{ width: pct + "%" }} /></div>
            <div style={{ marginTop: "0.5rem", fontSize: "0.72rem", opacity: 0.4 }}>{catLabel()}{form.types.length > 0 ? " / " + form.types.join(", ") : ""}</div>
          </div>
        )}

        {/* STEP 0 — Category */}
        {step === 0 && (
          <div className="fade">
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.red, fontWeight: 600, marginBottom: "0.6rem" }}>01 / Category</p>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "0.5rem", lineHeight: 1.2 }}>What category are you creating?</h2>
            <p style={{ fontSize: "0.85rem", opacity: 0.45, marginBottom: "2rem", lineHeight: 1.5 }}>Answer a few questions — the lab will prepare a formulation direction and indicative price.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "0.8rem" }}>
              {CATS.map(cat => (
                <button key={cat.id} className={"catcard" + (form.cat === cat.id ? " sel" : "")} onClick={() => selectCat(cat.id)}>
                  <div style={{ fontSize: "1.4rem", marginBottom: "0.7rem", color: C.red, opacity: 0.7 }}>{cat.icon}</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>{cat.label}</div>
                  <div style={{ fontSize: "0.72rem", opacity: 0.4, lineHeight: 1.4 }}>{cat.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 — Product type */}
        {step === 1 && (
          <div className="fade">
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.8rem" }}>What type of product are you creating?</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginBottom: "2rem" }}>
              {(PRODUCTS[form.cat] || []).map(tp => (
                <button key={tp} className={"chip" + (form.types.includes(tp) ? " sel" : "")} onClick={() => setForm(f => ({ ...f, types: f.types.includes(tp) ? f.types.filter(x => x !== tp) : [...f.types, tp], skin: [], effects: [] }))}>{tp}</button>
              ))}
            </div>
            {form.types.length > 0 && (
              <div style={{ marginBottom: "1.5rem", padding: "0.75rem 1rem", background: C.pink, fontSize: "0.78rem", borderLeft: `3px solid ${C.red}` }}>
                <strong>{form.types.length} product{form.types.length > 1 ? "s" : ""} selected</strong>{form.types.length > 1 ? ` — ${form.types.join(", ")}` : ` — ${form.types[0]}`}
              </div>
            )}
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn ghost" onClick={() => setStep(0)}>← Back</button>
              <button className="btn" disabled={!canNext()} onClick={() => setStep(2)}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 2 — Skin/hair type */}
        {step === 2 && (
          <div className="fade">
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>{ctx.label}</h2>
            <p style={{ fontSize: "0.82rem", opacity: 0.5, marginBottom: "1.8rem" }}>Multiple selections allowed</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginBottom: "3rem" }}>
              {(ctx.options || []).map(s => (
                <button key={s} className={"chip" + (form.skin.includes(s) ? " sel" : "")} onClick={() => toggle("skin", s)}>{s}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn" disabled={!canNext()} onClick={() => setStep(3)}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — Effects */}
        {step === 3 && (
          <div className="fade">
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Desired effects</h2>
            <p style={{ fontSize: "0.82rem", opacity: 0.5, marginBottom: "1.8rem" }}>Choose up to 3</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginBottom: "3rem" }}>
              {(ctx.effects || []).map(e => (
                <button key={e}
                  className={"chip" + (form.effects.includes(e) ? " sel" : "") + ((!form.effects.includes(e) && form.effects.length >= 3) ? " dim" : "")}
                  onClick={() => { if (!form.effects.includes(e) && form.effects.length >= 3) return; toggle("effects", e); }}>
                  {e}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn ghost" onClick={() => setStep(2)}>← Back</button>
              <button className="btn" disabled={!canNext()} onClick={() => setStep(4)}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 4 — Avoid */}
        {step === 4 && (
          <div className="fade">
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Ingredients to avoid</h2>
            <p style={{ fontSize: "0.82rem", opacity: 0.5, marginBottom: "1.8rem" }}>Optional</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginBottom: "3rem" }}>
              {AVOID_OPTS.map(av => (
                <button key={av} className={"chip" + (form.avoid.includes(av) ? " sel" : "")} onClick={() => toggle("avoid", av)}>{av}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn ghost" onClick={() => setStep(3)}>← Back</button>
              <button className="btn" onClick={() => setStep(5)}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 5 — Pricing */}
        {step === 5 && (
          <div className="fade">
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.8rem" }}>Quantity & price</h2>
            <p style={{ fontSize: "0.78rem", opacity: 0.4, marginBottom: "2rem" }}>Minimum order: 500 units. Price excludes packaging and labelling.</p>
            <div style={{ background: C.red, color: C.white, padding: "1.8rem 2rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.65, marginBottom: "0.4rem" }}>Price / unit</div>
                  <div style={{ fontFamily: "'Afacad',sans-serif", fontSize: "clamp(2.2rem,6vw,3rem)", fontWeight: 700, lineHeight: 1 }}>
                    {getPrice(pricing.qty || 500).toFixed(2)}<span style={{ fontSize: "1rem", fontWeight: 400, opacity: 0.75, marginLeft: "0.3rem" }}>EUR</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {form.types.length > 1 && (
                    <div style={{ fontSize: "0.75rem", opacity: 0.7, marginBottom: "0.3rem" }}>
                      {form.types.length} products × {(pricing.qty || 500).toLocaleString()} units = {((pricing.qty || 500) * form.types.length).toLocaleString()} units total
                    </div>
                  )}
                  <div style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.65, marginBottom: "0.4rem" }}>Total amount</div>
                  <div style={{ fontFamily: "'Afacad',sans-serif", fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 700, lineHeight: 1 }}>
                    ~{Math.round((pricing.qty || 500) * getPrice(pricing.qty || 500) * Math.max(1, form.types.length)).toLocaleString()}<span style={{ fontSize: "0.9rem", fontWeight: 400, marginLeft: "0.3rem", opacity: 0.75 }}>EUR</span>
                  </div>
                </div>
              </div>
              {form.types.length > 1 && (
                <div style={{ marginTop: "1rem", paddingTop: "0.8rem", borderTop: "1px solid rgba(255,255,255,0.15)", fontSize: "0.72rem", opacity: 0.7 }}>
                  Per product: ~{Math.round((pricing.qty || 500) * getPrice(pricing.qty || 500)).toLocaleString()} EUR · {form.types.slice(0, 3).join(", ")}{form.types.length > 3 ? ` +${form.types.length - 3} more` : ""}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
              {PRICE_TIERS.map(tier => (
                <button key={tier.qty} onClick={() => setPricing({ qty: tier.qty, pricePerUnit: tier.price, total: Math.round(tier.qty * tier.price * Math.max(1, form.types.length)) })}
                  style={{ padding: "0.6rem 1rem", fontSize: "0.82rem", fontFamily: "'Afacad',sans-serif", border: "1.5px solid " + (pricing.qty === tier.qty ? C.red : "rgba(0,0,0,0.12)"), background: pricing.qty === tier.qty ? C.red : C.white, color: pricing.qty === tier.qty ? C.white : C.black, cursor: "pointer", transition: "all 0.15s" }}>
                  {tier.label} — {tier.price.toFixed(2)} EUR
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn ghost" onClick={() => setStep(4)}>← Back</button>
              <button className="btn" disabled={!pricing.qty} onClick={() => setStep(6)}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 6 — Packaging */}
        {step === 6 && (
          <div className="fade">
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Packaging</h2>
            <p style={{ fontSize: "0.82rem", opacity: 0.5, marginBottom: "2rem" }}>Select packaging from the Eurovétrocap catalogue (2026) and preferred volume.</p>
            <div style={{ padding: "1.5rem", background: C.pink, borderLeft: `3px solid ${C.red}`, marginBottom: "2rem", fontSize: "0.88rem" }}>
              Packaging catalogue coming soon. You can continue for now — the lab will suggest options during consultation.
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn ghost" onClick={() => setStep(5)}>← Back</button>
              <button className="btn" onClick={() => setStep(7)}>Skip →</button>
            </div>
          </div>
        )}

        {/* STEP 7 — Brief */}
        {step === 7 && (
          <div className="fade">
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Additional information</h2>
            <p style={{ fontSize: "0.82rem", opacity: 0.5, marginBottom: "1.8rem" }}>Optional — texture, scent, positioning, inspiration</p>
            <textarea rows={4} placeholder="e.g. Natural line, vegan, luxury feel, specific scent..." value={form.brief}
              onChange={e => setForm(f => ({ ...f, brief: e.target.value }))} style={{ marginBottom: "1.5rem" }} />

            {/* Summary */}
            <div style={{ background: C.white, border: "1.5px solid rgba(0,0,0,0.08)", padding: "1.2rem 1.4rem", marginBottom: "1.5rem", fontSize: "0.85rem", lineHeight: 2 }}>
              <div style={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.red, fontWeight: 600, marginBottom: "0.5rem" }}>Request summary</div>
              <div><span style={{ opacity: 0.45, fontSize: "0.72rem", marginRight: "0.5rem" }}>Category</span>{catLabel()}</div>
              <div><span style={{ opacity: 0.45, fontSize: "0.72rem", marginRight: "0.5rem" }}>Products</span>{form.types.join(", ")}</div>
              {form.skin.length > 0 && <div><span style={{ opacity: 0.45, fontSize: "0.72rem", marginRight: "0.5rem" }}>{ctx.label}</span>{form.skin.join(", ")}</div>}
              <div><span style={{ opacity: 0.45, fontSize: "0.72rem", marginRight: "0.5rem" }}>Effects</span>{form.effects.join(", ")}</div>
              {pricing.qty > 0 && (
                <div style={{ marginTop: "0.5rem", paddingTop: "0.6rem", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                  <span style={{ opacity: 0.45, fontSize: "0.72rem", marginRight: "0.5rem" }}>Quantity</span>
                  {pricing.qty} units <span style={{ marginLeft: "1rem", color: C.red, fontWeight: 700 }}>~{pricing.total.toLocaleString()} EUR</span>
                </div>
              )}
            </div>

            {loading && [100, 100, 60].map((w, i) => <div key={i} className="sk" style={{ height: "10px", width: w + "%" }} />)}
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <button className="btn ghost" onClick={() => setStep(6)} disabled={loading}>← Back</button>
              <button className="btn" onClick={() => { if (!leadDone) { setShowLeadForm(true); } else { submit(); } }} disabled={loading}>{loading ? `Formulating ${form.types.length > 1 ? form.types.length + " products" : form.types[0] || ""}...` : "Get direction →"}</button>
            </div>
          </div>
        )}

        {/* STEP 8 — Result */}
        {step === 8 && result && (
          <div className="fade">
            {!showSample && !showWaitlist && (
              <>
                <div className="result-header">
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.6, marginBottom: "0.5rem" }}>the very lab / formulation direction</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.2, marginBottom: "0.4rem" }}>{form.types.join(" · ")}</div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.65 }}>{catLabel()} · {new Date().toLocaleDateString("en-GB")}</div>
                </div>

                {pricing.qty > 0 && (
                  <div style={{ background: C.black, color: C.white, padding: "1rem 1.8rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div><div style={{ fontSize: "0.62rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.1em" }}>Quantity</div><div style={{ fontWeight: 600 }}>{pricing.qty.toLocaleString()} units</div></div>
                    <div><div style={{ fontSize: "0.62rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.1em" }}>Price / unit</div><div style={{ fontWeight: 600 }}>{pricing.pricePerUnit.toFixed(2)} EUR</div></div>
                    <div style={{ textAlign: "right" }}><div style={{ fontSize: "0.62rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.1em" }}>Total{form.types.length > 1 ? ` (${form.types.length} products)` : ""}</div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: C.pinkMid }}>~{pricing.total.toLocaleString()} EUR</div></div>
                  </div>
                )}

                <div className="result-body">{renderResult(result)}</div>

                <div style={{ background: C.pink, padding: "1rem 1.4rem", fontSize: "0.75rem", opacity: 0.8, lineHeight: 1.6, borderLeft: `3px solid ${C.red}` }}>
                  Preliminary formulation direction and indicative price. Final formula and exact price provided after lab consultation. Contact us: <strong>hello@theverylab.com</strong>
                </div>

                <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button className="btn" onClick={reset}>New formula →</button>
                  <button className="btn ghost" onClick={() => navigator.clipboard?.writeText(result)}>Copy</button>
                  <button className="btn dark" onClick={() => { setShowSample(true); setShowWaitlist(false); }}>🧪 Order a sample →</button>
                  <button className="btn ghost" onClick={() => { setShowWaitlist(true); setShowSample(false); }}>⬟ Track my project →</button>
                </div>

                <EarningsCalc costPerUnit={costPerUnit} qty={pricing.qty} typesCount={form.types.length} />
              </>
            )}

            {showSample && <SampleRequest pricing={pricing} form={form} catLabel={catLabel()} onClose={() => setShowSample(false)} />}
            {showWaitlist && <Waitlist onClose={() => setShowWaitlist(false)} />}
      {showLeadForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "1rem" }}>
          <div className="fade" style={{ background: C.cream, maxWidth: "400px", width: "100%", padding: "2.5rem" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.red, fontWeight: 700, marginBottom: "0.5rem" }}>the very lab</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.3rem" }}>One last step</div>
            <p style={{ fontSize: "0.85rem", opacity: 0.55, lineHeight: 1.65, marginBottom: "1.8rem" }}>Leave your details and we'll send you the formulation direction.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.8rem" }}>
              <div>
                <div style={{ fontSize: "0.68rem", opacity: 0.45, marginBottom: "0.3rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Full name *</div>
                <input type="text" value={leadName} onChange={e => setLeadName(e.target.value)} placeholder="Jonas Jonaitis" />
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", opacity: 0.45, marginBottom: "0.3rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Phone number *</div>
                <input type="tel" value={leadPhone} onChange={e => setLeadPhone(e.target.value)} placeholder="+370 600 00000" />
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", opacity: 0.45, marginBottom: "0.3rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Email *</div>
                <input type="email" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} placeholder="jonas@yourbrand.com" />
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn ghost" onClick={() => setShowLeadForm(false)}>Cancel</button>
              <button className="btn" disabled={false} onClick={() => {
                setLeadDone(true); setShowLeadForm(false);
                fetch('https://api.emailjs.com/api/v1.0/email/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({service_id:'service_gm2rwtf',template_id:'template_kokwtbj',user_id:'HTYnH2QkvOWixD-we',template_params:{from_name:leadName,email:leadEmail,phone:leadPhone,category:catLabel(),products:form.types.join(', '),quantity:pricing.qty>0?pricing.qty+' units':'-'}})}).catch(()=>{});
                submit();
              }}>Get direction →</button>
            </div>
          </div>
        </div>
      )}

          </div>
        )}


      {showLeadForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "1rem" }}>
          <div className="fade" style={{ background: C.cream, maxWidth: "400px", width: "100%", padding: "2.5rem" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.red, fontWeight: 700, marginBottom: "0.5rem" }}>the very lab</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.3rem" }}>One last step</div>
            <p style={{ fontSize: "0.85rem", opacity: 0.55, lineHeight: 1.65, marginBottom: "1.8rem" }}>Leave your details and we'll send you the formulation direction.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.8rem" }}>
              <div>
                <div style={{ fontSize: "0.68rem", opacity: 0.45, marginBottom: "0.3rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Full name *</div>
                <input type="text" value={leadName} onChange={e => setLeadName(e.target.value)} placeholder="Jonas Jonaitis" />
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", opacity: 0.45, marginBottom: "0.3rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Phone number *</div>
                <input type="tel" value={leadPhone} onChange={e => setLeadPhone(e.target.value)} placeholder="+370 600 00000" />
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", opacity: 0.45, marginBottom: "0.3rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Email *</div>
                <input type="email" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} placeholder="jonas@yourbrand.com" />
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn ghost" onClick={() => setShowLeadForm(false)}>Cancel</button>
              <button className="btn" disabled={!leadName||!leadPhone||!leadEmail} onClick={() => { if(!leadName.trim()||!leadPhone.trim())return; setLeadDone(true); setShowLeadForm(false); fetch('https://api.emailjs.com/api/v1.0/email/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({service_id:'service_dfyzcmr',template_id:'template_kokwtbj',user_id:'HTYnH2QkvOWixD-we',template_params:{from_name:leadName,email:leadEmail,phone:leadPhone,category:catLabel(),products:form.types.join(', '),quantity:pricing.qty>0?pricing.qty+' units':'-'}})}).catch(()=>{}); submit(); }}>Get direction →</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
