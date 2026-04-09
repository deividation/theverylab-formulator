import React, { useState, useRef, useEffect } from "react";


// ============================================================
// TRANSLATIONS
// ============================================================
const T = {
  lt: {
    // NAV
    reset: "{t.reset}",
    demo: "DEMO",
    // HERO
    heroSub: "{t.heroSub}",
    heroTitle1: "Jūsų receptūra.",
    heroTitle2: "Mūsų laboratorija.",
    heroDesc: "{t.heroDesc}",
    heroStat1n: {t.heroStat1n}, heroStat1t: {t.heroStat1t},
    heroStat2n: {t.heroStat2n},   heroStat2t: {t.heroStat2t},
    heroStat3n: {t.heroStat3n}, heroStat3t: {t.heroStat3t},
    strip1: {t.strip1}, strip2: {t.strip2},
    strip3: {t.strip3}, strip4: {t.strip4},
    sl1: "Produkto tipas", sl3: {t.sEff}, sl4: "Ingredientai",
    sl5: {t.step5title}, sl6: "Pakuotė (EVC)", sl7: "Papildoma info",
    step0num: {t.step0num},
    step0title: {t.step0title},
    step0desc: {t.step0desc},
    step1title: {t.step1title},
    step1hint: {t.step1hint},
    step2hint: {t.step2hint},
    step3titleSkin: {t.step3titleSkin},
    step3title: {t.step3title},
    step3hint: {t.step3hint},
    step4title: {t.step4title},
    step4hint: {t.step4hint},
    step5title: "Kiekis ir kaina",
    minOrder: "{t.minOrder}",
    pricePer: {t.pricePer}, totalSum: {t.totalSum}, qty: {t.sQty},
    nudge1: {t.nudge1}, nudge2: {t.nudge2}, nudge3: {t.nudge3},
    nudge4: {t.nudge4}, nudge5: {t.nudge5},
    priceNote: "{t.priceNote}",
    step6title: {t.step6title},
    pkgDesc: {t.pkgDesc},
    pkgNone: {t.pkgNone},
    pkgSelected: "Pasirinktos pakuotės", pkgTotal: "Pakuotė viso",
    sizeLabel: {t.sizeLabel}, unitPrice: {t.unitPrice}, pkgCompat: "{t.pkgCompatNote}",
    step7title: {t.step7title},
    step7hint: {t.step7hint},
    step7ph: {t.step7ph},
    summaryTitle: {t.summaryTitle},
    sCat: {t.sCat}, sProd: {t.sProd}, sEff: "Efektai", sAvoid: {t.sAvoid}, sQty: {t.resQty}, sPkg: {t.sPkg},
    btnGet: "Gauti kryptį →", btnLoading: {t.btnLoading},
    resSubtitle: "{t.resSubtitle}",
    resQty: {t.qty}, resPriceU: {t.resPriceU}, resTotal: "Bendra suma",
    pkgResultTitle: {t.pkgResultTitle},
    formulaLine: {t.formulaLine}, pkgLine: {t.pkgLine}, totalLine: {t.totalLine},
    pkgCompatNote: "Suderinamumas su formuluote bus patvirtintas konsultacijos metu.",
    disclaimer: "{t.disclaimer}",
    contact: {t.contact},
    btnNew: "Nauja formulė →", btnCopy: {t.btnCopy},
    earnTitle: {t.earnTitle},
    earnSub: {t.earnSub},
    earnCostLabel: "Savikaina / vnt (su pakuote ir etikete)",
    mfgCost: {t.mfgCost}, pkgCost: {t.pkgCost}, lblCost: {t.lblCost}, totalCost: {t.totalCost},
    partija: {t.partija},
    sellLabel: {t.sellLabel},
    seg0:"Masinis / FMCG", seg1:"Vidutinis segmentas", seg2:"Premiumo linija", seg3:"Aukštas segmentas", seg4:"Luxury / Niche",
    mProfit: {t.mProfit}, mMargin: "Marža ", mRevenue: {t.mRevenue}, mNet: {t.mNet},
    mInvest: {t.mInvest}, mFullCost: {t.mFullCost},
    mfgBreak: "Gamyba: ", pkgBreak: "Pakuotė: ", lblBreak: "Etiketė: ",
    breakEven: "Break-even: ", breakEvenSuffix: " vnt — parduokite tiek ir susigrąžinate visą investiciją.",
    mktTitle: {t.mktTitle},
    mkt0: {label:"Masinis / FMCG", range:"15–18 EUR", margin:"~6–9 EUR/vnt"},
    mkt1: {label:"Vidutinis segmentas", range:"20–30 EUR", margin:"~11–21 EUR/vnt"},
    mkt2: {label:"Premium linija", range:"35–50 EUR", margin:"~26–41 EUR/vnt"},
    mkt3: {label:"Aukštas segmentas", range:"55–75 EUR", margin:"~46–66 EUR/vnt"},
    mkt4: {label:"Luxury / Niche", range:"80–100+ EUR", margin:"~71–91+ EUR/vnt"},
    shelfTitle: {t.shelfTitle},
    shelfDesc1: "Visos the very lab formuluotės atitinka ES reikalavimus ir turi ",
    shelfDesc2: "24 mėnesių tinkamumo laikotarpį",
    shelfDesc3: ". Pakankamai laiko parduoti visą partiją ir planuoti pakartotinį užsakymą.",
    finePrint: "* Skaičiavimai indikatyvūs. Gamyba = the very lab R&D + gamyba. Pakuotė = Eurovetrocap indikatyvi kaina. Etiketė = ~0.20 EUR/vnt. Neįskaičiuoti: logistika, mokesčiai, prekybos tinklo marža.",
    back: "← Atgal", next: "Tęsti →", skip: "Praleisti →",
    cats: [
      { id:"women",     label:"Moterims",    sub:"Veido ir kūno priežiūra",        icon:"◯" },
      { id:"men",       label:"Vyrams",      sub:"Skutimosi, barzdos ir plaukai",   icon:"◻" },
      { id:"pets",      label:"Gyvunams",    sub:"Šunims, katems ir kt.",            icon:"◇" },
      { id:"fragrance", label:"Kvepalai",    sub:"EDP, EDT, kūno dulksna ir kt.",   icon:"◎" },
      { id:"home",      label:"Namų kvapai", sub:"Žvakės, difuzoriai, purškikliai", icon:"△" },
    ],
    products: {
      women:     ["Serumas","Kremas","Tonikas","Veido aliejus","Kaukė","Akių kremas","Kūno losjonas","Kūno sviestas","Rankų kremas","Lūpų balzamas"],
      men:       ["Skutimosi puta","Skutimosi gelis","Balzamas po skutimosi","Barzdos aliejus","Barzdos balzamas","Barzdos šampūnas","Barzdos vaškas","Veido kremas","Kūno losjonas","Šampūnas","Kondicionierius","Plaukų serumas","Plaukų vaškas","Plaukų pasta","Plaukų gelis","Pomada"],
      pets:      ["Šampūnas šunims","Šampūnas katems","Kondicionierius","Kailio aliejus","Letenų kremas","Dezodorantas"],
      fragrance: ["Eau de Parfum","Eau de Toilette","Kūno dulksna","Plaukų dulksna","Kvepiantis kūno aliejus","Solid perfume","Automobilinis kvapas"],
      home:      ["Žvakė","Difuzorius (lazdelės)","Kambarinis purškiklis","Patalynės purškiklis","Aromatinis vaškas","Kvapų akmuo","Smilkalai"],
    },
    avoid: ["Parabenai","Silikonai","Mineralinis aliejus","Alkoholis","Dirbtiniai kvapai","Sulfatai","PEG junginiai","Sintetiniai dažai"],
    roiLabel: {t.roiLabel},
  },  en: {
    reset: "restart", demo: "DEMO",
    heroSub: "Private Label Cosmetics Laboratory",
    heroTitle1: "Your formula.", heroTitle2: "Our laboratory.",
    heroDesc: "Build your cosmetics brand with a professional private label laboratory. From concept to finished product.",
    heroStat1n: "500+", heroStat1t: "Formulas created",
    heroStat2n: "EU", heroStat2t: "Regulatory compliant",
    heroStat3n: "24 mo", heroStat3t: "Product shelf life",
    strip1: "✓ MOQ from 500 units", strip2: "✓ Eurovetrocap packaging",
    strip3: "✓ CPNP notification", strip4: "✓ Fast prototyping",
    sl1: "Product type", sl3: "Effects", sl4: "Ingredients",
    sl5: "Quantity & price", sl6: "Packaging (EVC)", sl7: "Additional info",
    step0num: "01 / Category", step0title: "What category are you creating?",
    step0desc: "Answer a few questions — the lab will prepare a formulation direction and indicative price.",
    step1title: "What type of product are you creating?", step1hint: "Next step: ",
    step2hint: "Multiple selections allowed",
    step3titleSkin: "Desired properties", step3title: "Desired effects", step3hint: "Choose up to 3",
    step4title: "Ingredients to avoid", step4hint: "Optional",
    step5title: "Quantity & price",
    minOrder: "Minimum order: 500 units. Price excludes packaging and labelling.",
    pricePer: "Price / unit", totalSum: "Total amount", qty: "Quantity",
    nudge1: "Order ", nudge2: " more units", nudge3: " and price drops to ",
    nudge4: " (save ~", nudge5: " EUR)",
    priceNote: "Indicative price for formulation and manufacturing. Final price confirmed after consultation.",
    step6title: "Packaging",
    pkgDesc: "Select packaging from the Eurovetrocap catalogue (2026) and preferred volume. Lab will confirm compatibility.",
    pkgNone: "No packaging available in catalogue for this product — the lab will suggest options during consultation.",
    pkgSelected: "Selected packaging", pkgTotal: "Packaging total",
    sizeLabel: "Volume", unitPrice: "unit price", pkgCompat: "Compatibility will be confirmed during consultation.",
    step7title: "Additional information",
    step7hint: "Optional — texture, scent, positioning, inspiration",
    step7ph: "e.g. Natural line, vegan, luxury feel, specific scent...",
    summaryTitle: "Request summary",
    sCat: "Category", sProd: "Product", sEff: "Effects", sAvoid: "Without", sQty: "Quantity", sPkg: "Packaging",
    btnGet: "Get direction →", btnLoading: "Formulating...",
    resSubtitle: "the very lab / formulation direction",
    resQty: "Quantity", resPriceU: "Price / unit", resTotal: "Total amount",
    pkgResultTitle: "Selected packaging (Eurovetrocap 2026)",
    formulaLine: "Formula: ", pkgLine: "Packaging: ", totalLine: "Total (excl. labels)",
    pkgCompatNote: "Formula compatibility will be confirmed during consultation.",
    disclaimer: "Preliminary formulation direction and indicative price. Final formula and exact price provided after lab consultation.",
    contact: "Contact us: ",
    btnNew: "New formula →", btnCopy: "Copy",
    earnTitle: "How much can you earn?", earnSub: "Potential earnings",
    earnCostLabel: "Cost price / unit (incl. packaging & label)",
    mfgCost: "Manufacturing (the very lab): ", pkgCost: "Packaging (EVC): ", lblCost: "Label: ", totalCost: "Total: ~",
    partija: " unit batch", sellLabel: "Selling price",
    seg0:"Mass market / FMCG", seg1:"Mid-range segment", seg2:"Premium line", seg3:"High-end segment", seg4:"Luxury / Niche",
    mProfit: "Profit / unit", mMargin: "Margin ", mRevenue: "Total revenue", mNet: "Net profit",
    mInvest: "Investment", mFullCost: "Full batch cost",
    mfgBreak: "Manufacturing: ", pkgBreak: "Packaging: ", lblBreak: "Label: ",
    breakEven: "Break-even: ", breakEvenSuffix: " units — sell this many to recover your full investment.",
    mkt0: {label:"Mass market / FMCG", range:"€15–18", margin:"~€6–9/unit"},
    mkt1: {label:"Mid-range segment", range:"€20–30", margin:"~€11–21/unit"},
    mkt2: {label:"Premium line", range:"€35–50", margin:"~€26–41/unit"},
    mkt3: {label:"High-end segment", range:"€55–75", margin:"~€46–66/unit"},
    mkt4: {label:"Luxury / Niche", range:"€80–100+", margin:"~€71–91+/unit"},
    shelfTitle: "2-year shelf life",
    shelfDesc1: "All the very lab formulas comply with EU regulations and carry a ",
    shelfDesc2: "24-month shelf life",
    shelfDesc3: ". Plenty of time to sell your full batch and plan a reorder.",
    finePrint: "* Estimates only. Manufacturing = the very lab R&D + production. Packaging = Eurovetrocap indicative price. Label = ~€0.20/unit. Excludes: logistics, taxes, retail margin.",
    back: "← Back", next: "Continue →", skip: "Skip →",
    cats: [
      { id:"women",     label:"Women",      sub:"Face & body care",           icon:"◯" },
      { id:"men",       label:"Men",        sub:"Shaving, beard & hair",       icon:"◻" },
      { id:"pets",      label:"Pets",       sub:"Dogs, cats & more",           icon:"◇" },
      { id:"fragrance", label:"Fragrance",  sub:"EDP, EDT, body mist & more",  icon:"◎" },
      { id:"home",      label:"Home scents",sub:"Candles, diffusers, sprays",  icon:"△" },
    ],
    products: {
      women:     ["Serum","Face cream","Toner","Face oil","Mask","Eye cream","Body lotion","Body butter","Hand cream","Lip balm"],
      men:       ["Shaving foam","Shaving gel","After-shave balm","Beard oil","Beard balm","Beard shampoo","Beard wax","Face cream","Body lotion","Shampoo","Conditioner","Hair serum","Hair wax","Hair paste","Hair gel","Pomade"],
      pets:      ["Dog shampoo","Cat shampoo","Conditioner","Coat oil","Paw cream","Deodorant"],
      fragrance: ["Eau de Parfum","Eau de Toilette","Body mist","Hair mist","Scented body oil","Solid perfume","Car fragrance"],
      home:      ["Candle","Reed diffuser","Room spray","Linen spray","Wax melt","Scent stone","Incense"],
    },
    avoid: ["Parabens","Silicones","Mineral oil","Alcohol","Artificial fragrances","Sulphates","PEG compounds","Synthetic dyes"],
    roiLabel: "ROI ",
  },
};
const C = {
  red:     "#9F132D",
  cream:   "#FBF8EE",
  pink:    "#F6D4D8",
  pinkMid: "#E26372",
  sand:    "#E6E2C1",
  blue:    "#B9D2FF",
  black:   "#000000",
  white:   "#FFFFFF",
};

// PRICING
const PRICE_TIERS = [
  { qty: 500,   price: 5.50, label: "500 vnt" },
  { qty: 1000,  price: 5.10, label: "1 000 vnt" },
  { qty: 2000,  price: 4.75, label: "2 000 vnt" },
  { qty: 3000,  price: 4.45, label: "3 000 vnt", popular: true },
  { qty: 5000,  price: 4.10, label: "5 000 vnt" },
  { qty: 10000, price: 3.70, label: "10 000 vnt" },
];

const getPrice = (qty) => {
  let t = PRICE_TIERS[0];
  for (const tier of PRICE_TIERS) { if (qty >= tier.qty) t = tier; }
  return t.price;
};

export default function App() {
  const [lang, setLang] = useState("lt");
  const t = T[lang];
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ cat: "", type: "", skin: [], effects: [], avoid: [], brief: "" });
  const [pricing, setPricing] = useState({ qty: 0, pricePerUnit: 0, total: 0 });
  const [packaging, setPackaging] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const topRef = useRef(null);

  const toggle = (field, val) => setForm(f => ({
    ...f, [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val]
  }));

  const selectCat = (id) => {
    setForm(f => ({ ...f, cat: id, type: "", skin: [], effects: [] }));
    setTimeout(() => setStep(1), 200);
  };

  const selectType = (tp) => setForm(f => ({ ...f, type: tp, skin: [], effects: [] }));

  const canNext = () => {
    if (step === 1) return form.type !== "";
    if (step === 2) return form.skin.length > 0;
    if (step === 3) return form.effects.length > 0;
    return true;
  };

  const catLabel = () => (t.cats.find(x => x.id === form.cat) || {}).label || "";
  const pct = step === 0 ? 0 : step >= 8 ? 100 : ((step - 1) / 7) * 100;

  const skinCtx = () => {
    if (!form.type) return { skinLabel: "Odos tipas", skinOptions: [], effectOptions: [] };
    const lt = T.lt;
    const hairTypes = ["Plaukų vaškas","Plaukų pasta","Plaukų gelis","Pomada","Šampūnas","Kondicionierius","Plaukų serumas","Barzdos aliejus","Barzdos balzamas","Barzdos šampūnas","Barzdos vaškas"];
    if (form.cat === "fragrance" || form.cat === "home") return { skinLabel: "Kvapų šeima", skipSkin: true, skinOptions: ["Gėlinis","Medinis","Citrusininis","Rytietiškas","Jūrinis"], effectOptions: ["Ilgas išlaikumas","Gaivumas","Intensyvumas","Subtilumas","Relaksacija"] };
    if (hairTypes.some(h => form.type.toLowerCase().includes(h.toLowerCase().split(" ")[0]))) return { skinLabel: "Plaukų tipas", skipSkin: true, skinOptions: ["Ploni","Stori","Tiesūs","Banguoti","Riebūs","Sausi"], effectOptions: ["Stiprus fiksavimas","Drėkinimas","Blizgesys","Minkštinimas","Apimtis"] };
    const def = { women: { skinLabel:"Odos tipas", skinOptions:["Sausa","Riebali","Mišri","Jautri","Normali","Brandesnė"], effectOptions:["Drėkinimas","Anti-aging","Šviesinimas","Raminimas","Porų mažinimas","Stangrumas","Apsauga"] }, men: { skinLabel:"Odos tipas", skinOptions:["Normali","Sausa","Riebali","Jautri"], effectOptions:["Drėkinimas","Raminimas","Anti-age","Stangrumas","Apsauga"] }, pets: { skinLabel:"Kailio tipas", skinOptions:["Normali","Jautri","Sausa","Riebali"], effectOptions:["Drėkinimas","Blizgesys","Kvapų šalinimas","Raminimas","Kailio stiprinimas"] } };
    return def[form.cat] || def.women;
  };

  const stepLabel = () => {
    const labels = ["", t.sl1, skinCtx().skinLabel, t.sl3, t.sl4, t.sl5, t.sl6, t.sl7];
    return labels[step] || "";
  };

  const submit = async () => {
    setLoading(true); setError(null); setResult(null);
    await new Promise(r => setTimeout(r, 1800));
    const mock = `RECEPTUROS KRYPTIS
Formuluotė sukurta ${form.type} produktui su pasirinktais parametrais.

AKTYVIEJI INGREDIENTAI
- Niacinamide 5% — porų mažinimas, lyginimas
- Hyaluronic Acid 2% — intensyvus drėkinimas
- Vitamin C 3% — antioksidantas, šviesinimas
- Panthenol 1% — barjero stiprinimas

KONCENTRACIJA
Vandens fazė: 70% / Aliejinė: 15% / Aktyvieji: 12%

REGULIACINĖS PASTABOS
Atitinka ES reglamentą (EC) Nr. 1223/2009. pH 5.5–6.0.

IŠSKIRTINUMAS
Triple moisture lock koncepcija — ilgalaikis drėkinimas.`;
    setResult(mock);
    setLoading(false);
    setStep(8);
  };

  const reset = () => { setStep(0); setForm({cat:"",type:"",skin:[],effects:[],avoid:[],brief:""}); setPricing({qty:0,pricePerUnit:0,total:0}); setPackaging([]); setSelectedSizes({}); setResult(null); setError(null); if(topRef.current) topRef.current.scrollIntoView(); };

  const renderResult = (txt) => txt.split("\n").map((line,i) => {
    const c = line.replace(/\*\*/g,"").replace(/\*/g,"").trim();
    if (!c) return <br key={i} />;
    const isH = ["RECEPTUROS","AKTYVIEJI","BAZINIAI","KONCENTRACIJA","REGULIACIN","ISKIRTINUMAS","FORMULAVIMO","KVAPINES","REKOMENDUOJAMOS"].some(h=>c.startsWith(h));
    if (isH) return <div key={i} style={{color:C.red,fontWeight:700,marginTop:"1.3rem",marginBottom:"0.4rem",fontSize:"0.75rem",letterSpacing:"0.1em",textTransform:"uppercase"}}>{c}</div>;
    if (c.startsWith("- ")||/^\d+\./.test(c)) return <div key={i} style={{paddingLeft:"1rem",marginBottom:"0.3rem",opacity:0.85,lineHeight:1.65}}>{c}</div>;
    return <div key={i} style={{marginBottom:"0.25rem",opacity:0.8,lineHeight:1.7}}>{c}</div>;
  });

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
    * { box-sizing:border-box; margin:0; padding:0; }
    body { background:${C.cream}; font-family:'Afacad',sans-serif; }
    .chip { cursor:pointer; padding:0.45rem 1rem; border:1.5px solid rgba(0,0,0,0.15); background:transparent; color:${C.black}; font-family:'Afacad',sans-serif; font-size:0.88rem; transition:all 0.18s; }
    .chip:hover { border-color:${C.red}; color:${C.red}; }
    .chip.sel { border-color:${C.red}; background:${C.red}; color:${C.white}; }
    .chip.dim { opacity:0.25; cursor:not-allowed; }
    .btn { border:none; padding:0.9rem 2.8rem; font-family:'Afacad',sans-serif; font-size:0.88rem; letter-spacing:0.08em; text-transform:uppercase; cursor:pointer; transition:all 0.2s; font-weight:600; background:${C.red}; color:${C.white}; }
    .btn:hover:not(:disabled) { background:#7d0f24; }
    .btn:disabled { opacity:0.35; cursor:not-allowed; }
    .btn.ghost { background:transparent; color:${C.red}; border:1.5px solid ${C.red}; padding:0.9rem 2rem; font-weight:500; }
    .btn.ghost:hover { background:${C.red}; color:${C.white}; }
    .fade { animation:fi 0.25s ease; }
    @keyframes fi { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    .bar { height:2px; background:rgba(0,0,0,0.08); }
    .fill { height:2px; background:${C.red}; transition:width 0.4s; }
    .catcard { cursor:pointer; border:1.5px solid rgba(0,0,0,0.1); padding:1.5rem 1.3rem; background:${C.white}; transition:all 0.2s; text-align:left; }
    .catcard:hover { border-color:${C.red}; transform:translateY(-2px); box-shadow:0 4px 16px rgba(159,19,45,0.1); }
    .catcard.sel { border-color:${C.red}; background:${C.pink}; }
    textarea { background:${C.white}; border:1.5px solid rgba(0,0,0,0.12); color:${C.black}; padding:1rem; font-family:'Afacad',sans-serif; font-size:0.9rem; resize:vertical; outline:none; width:100%; line-height:1.6; }
    textarea:focus { border-color:${C.red}; }
    textarea::placeholder { color:rgba(0,0,0,0.3); }
    .nav { background:${C.white}; border-bottom:1px solid rgba(0,0,0,0.07); padding:0 1.5rem; height:52px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:10; }
    .result-header { background:${C.red}; color:${C.white}; padding:2rem; }
    .result-body { background:${C.white}; border:1.5px solid rgba(0,0,0,0.08); padding:1.8rem; font-size:0.9rem; line-height:1.7; }
    .sk { background:linear-gradient(90deg,rgba(159,19,45,0.04) 0%,rgba(159,19,45,0.1) 50%,rgba(159,19,45,0.04) 100%); background-size:200% 100%; animation:sk 1.5s infinite; margin-bottom:0.7rem; }
    @keyframes sk { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  `;

  return (
    <div style={{ minHeight:"100vh", background:C.cream, fontFamily:"'Afacad',sans-serif", color:C.black }} ref={topRef}>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <div style={{ fontFamily:"'Afacad',sans-serif", fontWeight:600, fontSize:"1rem", letterSpacing:"0.02em" }}>the very lab</div>
        <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
          <div style={{ fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", background:"#f59e0b", color:"#000", padding:"0.2rem 0.6rem", fontWeight:700 }}>DEMO</div>
          <div style={{ display:"flex", gap:"0.3rem" }}>
            {["lt","en"].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding:"0.15rem 0.5rem", fontSize:"0.72rem", fontFamily:"'Afacad',sans-serif",
                border:"1.5px solid " + (lang===l ? C.red : "rgba(0,0,0,0.15)"),
                background: lang===l ? C.red : "transparent",
                color: lang===l ? C.white : C.black,
                cursor:"pointer", fontWeight: lang===l ? 700 : 400,
                textTransform:"uppercase",
              }}>{l==="lt" ? "🇱🇹 LT" : "🇬🇧 EN"}</button>
            ))}
          </div>
          {step > 0 && step < 8 && (
            <button onClick={reset} style={{background:"none",border:"none",cursor:"pointer",fontSize:"0.75rem",color:C.red,letterSpacing:"0.06em",textTransform:"uppercase",fontFamily:"'Afacad',sans-serif",fontWeight:500}}>
              {lang==="lt" ? "iš naujo" : "restart"}
            </button>
          )}
        </div>
      </nav>

      {/* HERO */}
      {step === 0 && (
        <>
          <div style={{ background:C.red, padding:"4.5rem 2rem 4rem", textAlign:"center" }}>
            <div style={{ maxWidth:"620px", margin:"0 auto" }}>
              <p style={{ fontSize:"0.68rem", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(255,255,255,0.55)", marginBottom:"1.2rem" }}>{t.heroSub || (lang==="lt" ? "Private Label Kosmetikos Laboratorija" : "Private Label Cosmetics Laboratory")}</p>
              <h1 style={{ fontFamily:"'Afacad',sans-serif", fontSize:"clamp(2.4rem,6vw,3.8rem)", fontWeight:700, color:C.white, lineHeight:1.08, marginBottom:"1.4rem", letterSpacing:"-0.02em" }}>
                {t.heroTitle1}<br />{t.heroTitle2}
              </h1>
              <p style={{ fontSize:"1.05rem", color:"rgba(255,255,255,0.72)", lineHeight:1.65, maxWidth:"440px", margin:"0 auto 2rem" }}>
                {lang==="lt" ? "Sukurkite savo kosmetikos liniją su profesionalia privačios etiketės laboratorija. Nuo idėjos iki gatavo produkto." : "Build your cosmetics brand with a professional private label laboratory. From concept to finished product."}
              </p>
              <div style={{ display:"flex", justifyContent:"center", gap:"1.5rem", flexWrap:"wrap" }}>
                {[
                  { n:t.heroStat1n, t:t.heroStat1t },
                  { n:t.heroStat2n, t:t.heroStat2t },
                  { n:t.heroStat3n, t:t.heroStat3t },
                ].map((s,i) => (
                  <div key={i} style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"'Afacad',sans-serif", fontSize:"1.6rem", fontWeight:700, color:C.white, lineHeight:1 }}>{s.n}</div>
                    <div style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.55)", letterSpacing:"0.06em", textTransform:"uppercase", marginTop:"0.3rem" }}>{s.t}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ background:C.black, color:C.white, padding:"1.1rem 2rem" }}>
            <div style={{ maxWidth:"660px", margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center", gap:"2rem", flexWrap:"wrap" }}>
              {[t.strip1,t.strip2,t.strip3,t.strip4].map((s,i) => (
                <span key={i} style={{ fontSize:"0.75rem", letterSpacing:"0.05em", opacity:0.8 }}>{s}</span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MAIN */}
      <div style={{ maxWidth:"660px", margin:"0 auto", padding: step === 0 ? "3rem 1.5rem 5rem" : "2.5rem 1.5rem 5rem" }}>

        {/* Progress */}
        {step >= 1 && step < 8 && (
          <div style={{ marginBottom:"2.5rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.8rem" }}>
              <div style={{ fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.red, fontWeight:600 }}>{stepLabel()}</div>
              <div style={{ fontSize:"0.7rem", opacity:0.35 }}>{step} / 7</div>
            </div>
            <div className="bar"><div className="fill" style={{ width:pct+"%" }} /></div>
            <div style={{ marginTop:"0.5rem", fontSize:"0.72rem", opacity:0.4 }}>
              {catLabel()}{form.type ? " / " + form.type : ""}
            </div>
          </div>
        )}

        {/* STEP 0 */}
        {step === 0 && (
          <div className="fade">
            <p style={{ fontSize:"0.72rem", letterSpacing:"0.12em", textTransform:"uppercase", color:C.red, fontWeight:600, marginBottom:"0.6rem" }}>{t.step0num}</p>
            <h2 style={{ fontSize:"1.6rem", fontWeight:700, marginBottom:"0.5rem", lineHeight:1.2 }}>{t.step0title}</h2>
            <p style={{ fontSize:"0.85rem", opacity:0.45, marginBottom:"2rem", lineHeight:1.5 }}>{t.step0desc}</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:"0.8rem" }}>
              {t.cats.map(cat => (
                <button key={cat.id} className={"catcard"+(form.cat===cat.id?" sel":"")} onClick={()=>selectCat(cat.id)}>
                  <div style={{ fontSize:"1.4rem", marginBottom:"0.7rem", color:C.red, opacity:0.7 }}>{cat.icon}</div>
                  <div style={{ fontSize:"1.1rem", fontWeight:700, marginBottom:"0.25rem" }}>{cat.label}</div>
                  <div style={{ fontSize:"0.72rem", opacity:0.4, lineHeight:1.4 }}>{cat.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="fade">
            <h2 style={{ fontSize:"1.5rem", fontWeight:700, marginBottom:"1.8rem" }}>{t.step1title}</h2>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.55rem", marginBottom:"2rem" }}>
              {(t.products[form.cat]||[]).map(tp => (
                <button key={tp} className={"chip"+(form.type===tp?" sel":"")} onClick={()=>selectType(tp)}>{tp}</button>
              ))}
            </div>
            {form.type && (
              <div style={{ marginBottom:"1.5rem", padding:"0.75rem 1rem", background:C.pink, fontSize:"0.78rem", borderLeft:"3px solid "+C.red }}>
                {t.step1hint}<strong>{skinCtx().skinLabel}</strong>
              </div>
            )}
            <div style={{ display:"flex", gap:"1rem" }}>
              <button className="btn ghost" onClick={()=>setStep(0)}>{t.back}</button>
              <button className="btn" disabled={!canNext()} onClick={()=>setStep(2)}>{t.next}</button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="fade">
            <h2 style={{ fontSize:"1.5rem", fontWeight:700, marginBottom:"0.5rem" }}>{skinCtx().skinLabel}</h2>
            <p style={{ fontSize:"0.82rem", opacity:0.5, marginBottom:"1.8rem" }}>{t.step2hint}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.55rem", marginBottom:"3rem" }}>
              {(skinCtx().skinOptions||[]).map(s => (
                <button key={s} className={"chip"+(form.skin.includes(s)?" sel":"")} onClick={()=>toggle("skin",s)}>{s}</button>
              ))}
            </div>
            <div style={{ display:"flex", gap:"1rem" }}>
              <button className="btn ghost" onClick={()=>setStep(1)}>{t.back}</button>
              <button className="btn" disabled={!canNext()} onClick={()=>setStep(3)}>{t.next}</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="fade">
            <h2 style={{ fontSize:"1.5rem", fontWeight:700, marginBottom:"0.5rem" }}>{t.step3title}</h2>
            <p style={{ fontSize:"0.82rem", opacity:0.5, marginBottom:"1.8rem" }}>{t.step3hint}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.55rem", marginBottom:"3rem" }}>
              {(skinCtx().effectOptions||[]).map(e => (
                <button key={e}
                  className={"chip"+(form.effects.includes(e)?" sel":"")+(((!form.effects.includes(e))&&form.effects.length>=3)?" dim":"")}
                  onClick={()=>{ if(!form.effects.includes(e)&&form.effects.length>=3) return; toggle("effects",e); }}>{e}</button>
              ))}
            </div>
            <div style={{ display:"flex", gap:"1rem" }}>
              <button className="btn ghost" onClick={()=>setStep(2)}>{t.back}</button>
              <button className="btn" disabled={!canNext()} onClick={()=>setStep(4)}>{t.next}</button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="fade">
            <h2 style={{ fontSize:"1.5rem", fontWeight:700, marginBottom:"0.5rem" }}>{t.step4title}</h2>
            <p style={{ fontSize:"0.82rem", opacity:0.5, marginBottom:"1.8rem" }}>{t.step4hint}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.55rem", marginBottom:"3rem" }}>
              {t.avoid.map(av => (
                <button key={av} className={"chip"+(form.avoid.includes(av)?" sel":"")} onClick={()=>toggle("avoid",av)}>{av}</button>
              ))}
            </div>
            <div style={{ display:"flex", gap:"1rem" }}>
              <button className="btn ghost" onClick={()=>setStep(3)}>{t.back}</button>
              <button className="btn" onClick={()=>setStep(5)}>{t.next}</button>
            </div>
          </div>
        )}

        {/* STEP 5 - PRICING */}
        {step === 5 && (
          <div className="fade">
            <h2 style={{ fontSize:"1.5rem", fontWeight:700, marginBottom:"1.8rem" }}>{t.step5title}</h2>
            <p style={{ fontSize:"0.78rem", opacity:0.4, marginBottom:"2rem" }}>{t.minOrder}</p>
            <div style={{ background:C.red, color:C.white, padding:"1.8rem 2rem", marginBottom:"2rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:"1rem" }}>
                <div>
                  <div style={{ fontSize:"0.62rem", letterSpacing:"0.15em", textTransform:"uppercase", opacity:0.65, marginBottom:"0.4rem" }}>{t.pricePer}</div>
                  <div style={{ fontFamily:"'Afacad',sans-serif", fontSize:"clamp(2.2rem,6vw,3rem)", fontWeight:700, lineHeight:1 }}>
                    {getPrice(pricing.qty||500).toFixed(2)}<span style={{ fontSize:"1rem", fontWeight:400, opacity:0.75, marginLeft:"0.3rem" }}>EUR</span>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:"0.62rem", letterSpacing:"0.15em", textTransform:"uppercase", opacity:0.65, marginBottom:"0.4rem" }}>{t.totalSum}</div>
                  <div style={{ fontFamily:"'Afacad',sans-serif", fontSize:"clamp(1.6rem,4vw,2.2rem)", fontWeight:700 }}>
                    {"~"+(Math.round((pricing.qty||500)*getPrice(pricing.qty||500))).toLocaleString("lt-LT")}<span style={{ fontSize:"0.9rem", fontWeight:400, opacity:0.75, marginLeft:"0.3rem" }}>EUR</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap", marginBottom:"2rem" }}>
              {PRICE_TIERS.map(tier => (
                <button key={tier.qty} onClick={()=>setPricing({qty:tier.qty,pricePerUnit:tier.price,total:Math.round(tier.qty*tier.price)})}
                  style={{ padding:"0.6rem 1rem", fontSize:"0.82rem", fontFamily:"'Afacad',sans-serif",
                    border:"1.5px solid "+(pricing.qty===tier.qty?C.red:"rgba(0,0,0,0.12)"),
                    background:pricing.qty===tier.qty?C.red:C.white,
                    color:pricing.qty===tier.qty?C.white:C.black, cursor:"pointer", transition:"all 0.15s" }}>
                  {tier.label} — {tier.price.toFixed(2)} EUR
                </button>
              ))}
            </div>
            <div style={{ display:"flex", gap:"1rem" }}>
              <button className="btn ghost" onClick={()=>setStep(4)}>{t.back}</button>
              <button className="btn" disabled={!pricing.qty} onClick={()=>setStep(6)}>{t.next}</button>
            </div>
          </div>
        )}

        {/* STEP 6 - PACKAGING SKIP */}
        {step === 6 && (
          <div className="fade">
            <h2 style={{ fontSize:"1.5rem", fontWeight:700, marginBottom:"0.5rem" }}>{t.step6title}</h2>
            <p style={{ fontSize:"0.82rem", opacity:0.5, marginBottom:"2rem" }}>{t.pkgDesc}</p>
            <div style={{ padding:"1.5rem", background:C.pink, borderLeft:"3px solid "+C.red, marginBottom:"2rem", fontSize:"0.88rem" }}>
              {lang==="lt" ? "Pakuočių katalogas bus pridėtas greitai. Tuo tarpu galite tęsti." : "Packaging catalogue coming soon. You can continue for now."}
            </div>
            <div style={{ display:"flex", gap:"1rem" }}>
              <button className="btn ghost" onClick={()=>setStep(5)}>{t.back}</button>
              <button className="btn" onClick={()=>setStep(7)}>{t.skip}</button>
            </div>
          </div>
        )}

        {/* STEP 7 - BRIEF */}
        {step === 7 && (
          <div className="fade">
            <h2 style={{ fontSize:"1.5rem", fontWeight:700, marginBottom:"0.5rem" }}>{t.step7title}</h2>
            <p style={{ fontSize:"0.82rem", opacity:0.5, marginBottom:"1.8rem" }}>{t.step7hint}</p>
            <textarea rows={4} placeholder={t.step7ph} value={form.brief}
              onChange={e=>setForm(f=>({...f,brief:e.target.value}))} style={{marginBottom:"1.5rem"}} />
            <div style={{ background:C.white, border:"1.5px solid rgba(0,0,0,0.08)", padding:"1.2rem 1.4rem", marginBottom:"1.5rem", fontSize:"0.85rem", lineHeight:2 }}>
              <div style={{ fontSize:"0.62rem", letterSpacing:"0.12em", textTransform:"uppercase", color:C.red, fontWeight:600, marginBottom:"0.5rem" }}>{t.summaryTitle}</div>
              <div><span style={{ opacity:0.45, fontSize:"0.72rem", marginRight:"0.5rem" }}>{t.sCat}</span>{catLabel()}</div>
              <div><span style={{ opacity:0.45, fontSize:"0.72rem", marginRight:"0.5rem" }}>{t.sProd}</span>{form.type}</div>
              {form.skin.length>0 && <div><span style={{ opacity:0.45, fontSize:"0.72rem", marginRight:"0.5rem" }}>{skinCtx().skinLabel}</span>{form.skin.join(", ")}</div>}
              <div><span style={{ opacity:0.45, fontSize:"0.72rem", marginRight:"0.5rem" }}>{t.sEff}</span>{form.effects.join(", ")}</div>
              {pricing.qty>0 && <div style={{ marginTop:"0.5rem", paddingTop:"0.6rem", borderTop:"1px solid rgba(0,0,0,0.07)" }}>
                <span style={{ opacity:0.45, fontSize:"0.72rem", marginRight:"0.5rem" }}>{t.qty}</span>
                {pricing.qty+" vnt"}
                <span style={{ marginLeft:"1rem", color:C.red, fontWeight:700 }}>{"~"+pricing.total.toLocaleString("lt-LT")+" EUR"}</span>
              </div>}
            </div>
            {loading && [100,100,60].map((w,i)=><div key={i} className="sk" style={{height:"10px",width:w+"%"}} />)}
            <div style={{ display:"flex", gap:"1rem", marginTop:"0.5rem" }}>
              <button className="btn ghost" onClick={()=>setStep(6)} disabled={loading}>{t.back}</button>
              <button className="btn" onClick={submit} disabled={loading}>{loading?t.btnLoading:t.btnGet}</button>
            </div>
          </div>
        )}

        {/* STEP 8 - RESULT */}
        {step === 8 && result && (
          <div className="fade">
            <div className="result-header">
              <div style={{ fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", opacity:0.6, marginBottom:"0.5rem" }}>{t.resSubtitle}</div>
              <div style={{ fontSize:"1.6rem", fontWeight:700, lineHeight:1.2, marginBottom:"0.4rem" }}>{form.type}</div>
              <div style={{ fontSize:"0.8rem", opacity:0.65 }}>{catLabel()+" · "+new Date().toLocaleDateString("lt-LT")}</div>
            </div>
            {pricing.qty>0 && (
              <div style={{ background:C.black, color:C.white, padding:"1rem 1.8rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem" }}>
                <div><div style={{ fontSize:"0.62rem", opacity:0.5, textTransform:"uppercase", letterSpacing:"0.1em" }}>{t.resQty}</div><div style={{ fontWeight:600 }}>{pricing.qty.toLocaleString("lt-LT")+" vnt"}</div></div>
                <div><div style={{ fontSize:"0.62rem", opacity:0.5, textTransform:"uppercase", letterSpacing:"0.1em" }}>{t.resPriceU}</div><div style={{ fontWeight:600 }}>{pricing.pricePerUnit.toFixed(2)+" EUR"}</div></div>
                <div style={{ textAlign:"right" }}><div style={{ fontSize:"0.62rem", opacity:0.5, textTransform:"uppercase", letterSpacing:"0.1em" }}>{t.resTotal}</div><div style={{ fontSize:"1.3rem", fontWeight:700, color:C.pinkMid }}>{"~"+pricing.total.toLocaleString("lt-LT")+" EUR"}</div></div>
              </div>
            )}
            <div className="result-body">{renderResult(result)}</div>
            <div style={{ background:C.pink, padding:"1rem 1.4rem", fontSize:"0.75rem", opacity:0.8, lineHeight:1.6, borderLeft:"3px solid "+C.red }}>
              {t.disclaimer} {t.contact}<strong>hello@theverylab.com</strong>
            </div>
            <div style={{ marginTop:"2rem", display:"flex", gap:"1rem", flexWrap:"wrap" }}>
              <button className="btn" onClick={reset}>{t.btnNew}</button>
              <button className="btn ghost" onClick={()=>navigator.clipboard&&navigator.clipboard.writeText(result)}>{t.btnCopy}</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
