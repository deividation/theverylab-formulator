import React, { useState, useRef, useEffect } from "react";

// THE VERY LAB BRAND TOKENS
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

const CATEGORIES = [
  { id: "women",     label: "Moterims",   sub: "Veido ir kuno prieziura",        icon: "â¯" },
  { id: "men",       label: "Vyrams",     sub: "Skutimosi, barzdos ir plaukai",   icon: "â»" },
  { id: "pets",      label: "Gyvunams",   sub: "Å unims, katems ir kt.",           icon: "â" },
  { id: "fragrance", label: "Kvepalai",   sub: "EDP, EDT, kuno dulksna ir kt.",   icon: "â" },
  { id: "home",      label: "Namu kvapai",sub: "Å½vakes, difuzoriai, purÅ¡kikliai", icon: "â³" },
];

const PRODUCTS_BY_CAT = {
  women:     ["Serumas", "Kremas", "Tonikas", "Veido aliejus", "KaukÄ", "Akiu kremas", "Kuno losjonas", "Kuno sviestas", "RankÅ³ kremas", "LupÅ³ balzamas"],
  men:       ["Skutimosi puta", "Skutimosi gelis", "Balzamas po skutimosi", "Barzdos aliejus", "Barzdos balzamas", "Barzdos Å¡ampÅ«nas", "Barzdos vaÅ¡kas", "Veido kremas", "Kuno losjonas", "Å ampÅ«nas", "Kondicionierius", "PlaukÅ³ serumas", "PlaukÅ³ vaÅ¡kas", "PlaukÅ³ pasta", "PlaukÅ³ gelis", "Pomada"],
  pets:      ["Å ampÅ«nas Å¡unims", "Å ampÅ«nas katems", "Kondicionierius", "Kailio aliejus", "Letenu kremas", "Dezodorantas"],
  fragrance: ["Eau de Parfum", "Eau de Toilette", "Kuno dulksna", "PlaukÅ³ dulksna", "Kvepianti kuno aliejus", "Solid perfume", "Automobilinis kvapas"],
  home:      ["Å½vakÄ", "Difuzorius (lazdelÄs)", "Kambarinis purÅ¡kiklis", "PatalynÄs purÅ¡kiklis", "Aromatinis vaÅ¡kas", "KvapÅ³ akmuo", "Smilkalai"],
};

const PRODUCT_CONTEXT = {
  "PlaukÅ³ vaÅ¡kas":          { skipSkin:true, skinLabel:"PlaukÅ³ tipas",         skinOptions:["Ploni","Stori","TiesÅ«s","Banguoti/garbanoti","RiebÅ«s","Sausi"],                     effectOptions:["Stiprus fiksavimas","Vidutinis fiksavimas","Lankstus fiksavimas","Blizgesys","Matinis efektas","PlaukÅ³ apimtis"] },
  "PlaukÅ³ pasta":           { skipSkin:true, skinLabel:"PlaukÅ³ tipas",         skinOptions:["Ploni","Stori","TiesÅ«s","Banguoti/garbanoti","RiebÅ«s","Sausi"],                     effectOptions:["Stiprus fiksavimas","Vidutinis fiksavimas","NatÅ«ralus efektas","Matinis efektas","Blizgesys","Apimtis"] },
  "PlaukÅ³ gelis":           { skipSkin:true, skinLabel:"PlaukÅ³ tipas",         skinOptions:["Ploni","Stori","TiesÅ«s","Banguoti/garbanoti"],                                      effectOptions:["Stiprus fiksavimas","Vidutinis fiksavimas","Blizgesys","DrÄkinimas","Apimtis"] },
  "Pomada":                 { skipSkin:true, skinLabel:"PlaukÅ³ tipas",         skinOptions:["Ploni","Stori","TiesÅ«s","Banguoti/garbanoti"],                                      effectOptions:["Stiprus fiksavimas","Vidutinis fiksavimas","Blizgesys","Matinis efektas","Klasikinis efektas"] },
  "Å ampÅ«nas":               { skipSkin:true, skinLabel:"PlaukÅ³ / galvos odos tipas", skinOptions:["RiebÅ«s plaukai","Sausi plaukai","NormalÅ«s","Banguoti/garbanoti","Pleiskanoti","Silpni/slenantys"], effectOptions:["Giluminis valymas","DrÄkinimas","PleiskanÅ³ maÅ¾inimas","PlaukÅ³ stiprinimas","Blizgesys","Apimties suteikimas"] },
  "Kondicionierius":        { skipSkin:true, skinLabel:"PlaukÅ³ tipas",         skinOptions:["Sausi","PaÅ¾eisti","RiebÅ«s","Ploni","Stori","Banguoti/garbanoti"],                   effectOptions:["DrÄkinimas","PlaukÅ³ stiprinimas","Blizgesys","Lengvas Å¡ukavimas","Apsauga nuo karÅ¡Äio","NatÅ«ralus efektas"] },
  "PlaukÅ³ serumas":         { skipSkin:true, skinLabel:"PlaukÅ³ tipas",         skinOptions:["Sausi/paÅ¾eisti","Ploni/silpni","Banguoti/garbanoti","NormalÅ«s"],                    effectOptions:["DrÄkinimas","Blizgesys","Apsauga nuo karÅ¡Äio","PlaukÅ³ stiprinimas","Apimtis","GauruotÅ³ plaukÅ³ suvaldymas"] },
  "Barzdos aliejus":        { skipSkin:true, skinLabel:"Barzdos tipas",        skinOptions:["Trumpa barzda","Ilga barzda","StandÅ«s plaukai","MinkÅ¡ti plaukai","Jautri oda"],     effectOptions:["MinkÅ¡tinimas","DrÄkinimas","Blizgesys","Augimo skatinimas","Odos apsauga"] },
  "Barzdos balzamas":       { skipSkin:true, skinLabel:"Barzdos tipas",        skinOptions:["Trumpa barzda","Ilga barzda","StandÅ«s plaukai","MinkÅ¡ti plaukai"],                  effectOptions:["Fiksavimas","MinkÅ¡tinimas","DrÄkinimas","Blizgesys","Lengvas Å¡ukavimas"] },
  "Barzdos Å¡ampÅ«nas":       { skipSkin:true, skinLabel:"Barzdos / odos tipas", skinOptions:["RiebÅ«s plaukai","Sausi plaukai","Jautri oda","Normali"],                            effectOptions:["Valymas","MinkÅ¡tinimas","DrÄkinimas","KvapÅ³ Å¡alinimas","Odos apsauga"] },
  "Barzdos vaÅ¡kas":         { skipSkin:true, skinLabel:"Barzdos tipas",        skinOptions:["Trumpa barzda","StandÅ«s plaukai","MinkÅ¡ti plaukai"],                                effectOptions:["Stiprus fiksavimas","Vidutinis fiksavimas","Blizgesys","MinkÅ¡tinimas"] },
  "Skutimosi puta":         { skinLabel:"Odos tipas", skinOptions:["Normali","Jautri","Sausa","Riebali"],                                                                         effectOptions:["Raminimas","DrÄkinimas","Apsauga nuo dirglumo","Å velnus skutimasis","Antiseptinis efektas"] },
  "Skutimosi gelis":        { skinLabel:"Odos tipas", skinOptions:["Normali","Jautri","Sausa","Riebali"],                                                                         effectOptions:["Raminimas","DrÄkinimas","Tikslus skutimasis","Apsauga","VÄsinantis efektas"] },
  "Balzamas po skutimosi":  { skinLabel:"Odos tipas", skinOptions:["Normali","Jautri","Sausa","Riebali"],                                                                         effectOptions:["Raminimas","DrÄkinimas","Paraudimo maÅ¾inimas","Antibakterinis","Gaivus jausmas"] },
  "Veido kremas":           { skinLabel:"Odos tipas", skinOptions:["Normali","Sausa","Riebali","Jautri","MiÅ¡ri"],                                                                 effectOptions:["DrÄkinimas","Anti-age","Stangrumas","PorÅ³ maÅ¾inimas","Apsauga","Energizavimas"] },
  "Eau de Parfum":          { skipSkin:true, skinLabel:"KvapÅ³ Å¡eima", skinOptions:["GÄlinis","Medinis/Å¾emiÅ¡kas","RytietiÅ¡kas","Citrusininis","Vandenyno/jÅ«rinis","Maistinis","Å½alias/Å¡vieÅ¾ias"], effectOptions:["Ilgas iÅ¡laikumas (8h+)","Intensyvi sÄkmÄ","Subtilumas","Unisex","Å½iemos kvapas","Vasaros kvapas"] },
  "Eau de Toilette":        { skipSkin:true, skinLabel:"KvapÅ³ Å¡eima", skinOptions:["GÄlinis","Medinis/Å¾emiÅ¡kas","RytietiÅ¡kas","Citrusininis","Vandenyno/jÅ«rinis","Å½alias/Å¡vieÅ¾ias"], effectOptions:["Lengvas ir gaivus","Kasdienis neÅ¡iojimas","Subtilumas","Unisex","Vidutinis iÅ¡laikumas"] },
  "Kuno dulksna":           { skipSkin:true, skinLabel:"KvapÅ³ pobÅ«dis", skinOptions:["GÄlinis","Gaivus/citrusininis","Saldus/maistinis","Medinis","JÅ«rinis"],                    effectOptions:["Lengvas kvapas","DrÄkinimas","Greitas dÅ¾iuvimas","Subtilumas","Gaiva po duÅ¡o"] },
  "Automobilinis kvapas":   { skipSkin:true, skinLabel:"KvapÅ³ pobÅ«dis", skinOptions:["Gaivus/Å¡varus","Medinis/odos","Citrusininis","Å½alias","Neutralus"],                        effectOptions:["Ilgalaikis (30+ dienÅ³)","Stiprus skleidimas","Subtilus skleidimas","Neutralizuoja kvapus"] },
  "Å½vakÄ":                  { skipSkin:true, skinLabel:"KvapÅ³ Å¡eima", skinOptions:["GÄlinis","Medinis/Å¾emiÅ¡kas","Maistinis/gourmet","Å vieÅ¾ias/Å¾alias","RytietiÅ¡kas","JÅ«rinis","Neutralus/Å¡varus"], effectOptions:["Ilgas degimas (50h+)","Stiprus kvapas","Subtilus kvapas","Relaksacija","Energizavimas","RomantiÅ¡ka atmosfera"] },
  "Difuzorius (lazdelÄs)":  { skipSkin:true, skinLabel:"KvapÅ³ Å¡eima", skinOptions:["GÄlinis","Medinis/Å¾emiÅ¡kas","Maistinis/gourmet","Å vieÅ¾ias/Å¾alias","RytietiÅ¡kas","Neutralus"], effectOptions:["Ilgalaikis (60+ dienÅ³)","Stiprus skleidimas","Subtilus skleidimas","Relaksacija","Energizavimas"] },
  "PatalynÄs purÅ¡kiklis":   { skipSkin:true, skinLabel:"KvapÅ³ Å¡eima", skinOptions:["Lavandininis/raminantis","Medvilninis/Å¡varus","GÄlinis","Neutralus"],                        effectOptions:["Relaksacija","Geresniam miegui","Ilgalaikis kvapas audiniuose","Subtilumas","Antibakterinis efektas"] },
};

const DEFAULT_SKIN = {
  women:     { skinLabel:"Odos tipas",          skinOptions:["Sausa","Riebali","MiÅ¡ri","Jautri","Normali","BrandesnÄ"],       effectOptions:["DrÄkinimas","Anti-aging","Å viesinimas","Raminimas","PorÅ³ maÅ¾inimas","Stangrumas","Apsauga","Detoksikacija"] },
  men:       { skinLabel:"Odos tipas",          skinOptions:["Normali","Sausa","Riebali","Jautri"],                            effectOptions:["DrÄkinimas","Raminimas","Anti-age","Stangrumas","Apsauga"] },
  pets:      { skinLabel:"Kailio / odos tipas", skinOptions:["Normali","Jautri / alergiska","Sausa / lusojanti","Riebali","Senesnio gyvuno"], effectOptions:["DrÄkinimas","Blizgesys","KvapÅ³ Å¡alinimas","Raminimas","Apsauga nuo vabzdÅ¾iÅ³","Kailio stiprinimas"] },
  fragrance: { skinLabel:"KvapÅ³ Å¡eima",         skinOptions:["GÄlinis","Medinis","RytietiÅ¡kas","Citrusininis","JÅ«rinis"],      effectOptions:["Ilgas iÅ¡laikumas","Gaivumas","Intensyvumas","Subtilumas"] },
  home:      { skinLabel:"KvapÅ³ Å¡eima",         skinOptions:["GÄlinis","Medinis","Maistinis","Å vieÅ¾ias","RytietiÅ¡kas"],       effectOptions:["Ilgalaikis","Relaksacija","Energizavimas","Stiprus skleidimas"] },
};

const AVOID_OPTIONS = ["Parabenas", "Silikona", "Mineralinis aliejus", "Alkoholis", "Dirbtiniai kvapai", "Sulfatai", "PEG junginiai", "Sintetiniai daÅ¾ai"];

const STEP_LABELS = ["", "Produkto tipas", "Tipas", "Efektai", "Ingredientai", "Kiekis ir kaina", "Papildoma info"];

const css = [
  "@import url('https://fonts.googleapis.com/css2?family=Afacad:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');",
  "* { box-sizing:border-box; margin:0; padding:0; }",
  "body { background:" + C.cream + "; }",
  ".chip { cursor:pointer; padding:0.45rem 1rem; border:1.5px solid rgba(0,0,0,0.15); background:transparent; color:" + C.black + "; font-family:'Afacad',sans-serif; font-size:0.88rem; letter-spacing:0.01em; transition:all 0.18s; }",
  ".chip:hover { border-color:" + C.red + "; color:" + C.red + "; }",
  ".chip.sel { border-color:" + C.red + "; background:" + C.red + "; color:" + C.white + "; }",
  ".chip.dim { opacity:0.25; cursor:not-allowed; }",
  ".btn { border:none; padding:0.9rem 2.8rem; font-family:'Afacad',sans-serif; font-size:0.88rem; letter-spacing:0.08em; text-transform:uppercase; cursor:pointer; transition:all 0.2s; font-weight:600; background:" + C.red + "; color:" + C.white + "; }",
  ".btn:hover:not(:disabled) { background:#7d0f24; }",
  ".btn:disabled { opacity:0.35; cursor:not-allowed; }",
  ".btn.ghost { background:transparent; color:" + C.red + "; border:1.5px solid " + C.red + "; padding:0.9rem 2rem; font-weight:500; }",
  ".btn.ghost:hover { background:" + C.red + "; color:" + C.white + "; }",
  ".fade { animation:fi 0.25s ease; }",
  "@keyframes fi { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }",
  ".bar { height:2px; background:rgba(0,0,0,0.08); }",
  ".fill { height:2px; background:" + C.red + "; transition:width 0.4s; }",
  ".sk { background:linear-gradient(90deg,rgba(159,19,45,0.04) 0%,rgba(159,19,45,0.1) 50%,rgba(159,19,45,0.04) 100%); background-size:200% 100%; animation:sk 1.5s infinite; margin-bottom:0.7rem; }",
  "@keyframes sk { 0%{background-position:-200% 0} 100%{background-position:200% 0} }",
  ".catcard { cursor:pointer; border:1.5px solid rgba(0,0,0,0.1); padding:1.5rem 1.3rem; background:" + C.white + "; transition:all 0.2s; text-align:left; }",
  ".catcard:hover { border-color:" + C.red + "; transform:translateY(-2px); box-shadow:0 4px 16px rgba(159,19,45,0.1); }",
  ".catcard.sel { border-color:" + C.red + "; background:" + C.pink + "; }",
  ".tier { border:1.5px solid rgba(0,0,0,0.1); padding:1rem 1.1rem; cursor:pointer; transition:all 0.2s; text-align:left; background:" + C.white + "; }",
  ".tier:hover { border-color:" + C.red + "; }",
  ".tier.sel { border-color:" + C.red + "; background:" + C.pink + "; }",
  "textarea { background:" + C.white + "; border:1.5px solid rgba(0,0,0,0.12); color:" + C.black + "; padding:1rem; font-family:'Afacad',sans-serif; font-size:0.9rem; resize:vertical; outline:none; width:100%; line-height:1.6; }",
  "textarea:focus { border-color:" + C.red + "; }",
  "textarea::placeholder { color:rgba(0,0,0,0.3); }",
  ".qty-input { background:" + C.white + "; border:1.5px solid rgba(0,0,0,0.15); color:" + C.black + "; padding:0.6rem 0.9rem; font-family:'Afacad',sans-serif; font-size:0.9rem; outline:none; width:110px; text-align:center; }",
  ".qty-input:focus { border-color:" + C.red + "; }",
  ".nav { background:" + C.white + "; border-bottom:1px solid rgba(0,0,0,0.07); padding:0 1.5rem; height:52px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:10; }",
  ".result-header { background:" + C.red + "; color:" + C.white + "; padding:2rem; margin-bottom:0; }",
  ".result-body { background:" + C.white + "; border:1.5px solid rgba(0,0,0,0.08); padding:1.8rem; font-size:0.9rem; line-height:1.7; }",
].join("\n");

// Slider steps: 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7500, 10000
const SLIDER_STEPS = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 7500, 10000];

function PricingStep({ onBack, onNext, pricing, setPricing }) {
  const initIdx = pricing.qty ? Math.max(0, SLIDER_STEPS.indexOf(pricing.qty)) : 0;
  const [sliderIdx, setSliderIdx] = useState(initIdx < 0 ? 0 : initIdx);

  const qty = SLIDER_STEPS[sliderIdx];
  const pricePerUnit = getPrice(qty);
  const total = Math.round(qty * pricePerUnit);

  // Find which discount tier we're in and next tier
  const currentTierIdx = PRICE_TIERS.reduce((acc, t, i) => qty >= t.qty ? i : acc, 0);
  const nextTier = PRICE_TIERS[currentTierIdx + 1];
  const saving = PRICE_TIERS[0].price - pricePerUnit;

  const confirm = () => {
    setPricing({ qty, pricePerUnit, total });
    onNext();
  };

  // Slider fill %
  const fillPct = (sliderIdx / (SLIDER_STEPS.length - 1)) * 100;

  const sliderStyle = `
    .price-slider { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:2px; outline:none; cursor:pointer; background:linear-gradient(to right, ${C.red} ${fillPct}%, rgba(0,0,0,0.12) ${fillPct}%); }
    .price-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:24px; height:24px; border-radius:50%; background:${C.red}; cursor:pointer; border:3px solid ${C.white}; box-shadow:0 2px 8px rgba(159,19,45,0.35); transition:transform 0.15s; }
    .price-slider::-webkit-slider-thumb:hover { transform:scale(1.15); }
    .price-slider::-moz-range-thumb { width:24px; height:24px; border-radius:50%; background:${C.red}; cursor:pointer; border:3px solid ${C.white}; box-shadow:0 2px 8px rgba(159,19,45,0.35); }
  `;

  return (
    <div className="fade">
      <style>{sliderStyle}</style>
      <p style={{ fontSize: "0.78rem", opacity: 0.4, marginBottom: "2.5rem" }}>Minimalus uÅ¾sakymas: 500 vnt. Kaina be pakuotÄs ir etiketÄs.</p>

      {/* Big live price display */}
      <div style={{ background: C.red, color: C.white, padding: "1.8rem 2rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.65, marginBottom: "0.4rem" }}>Kaina vnt.</div>
            <div style={{ fontFamily: "'Afacad',sans-serif", fontSize: "clamp(2.2rem,6vw,3rem)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em" }}>
              {pricePerUnit.toFixed(2)}<span style={{ fontSize: "1rem", fontWeight: 400, opacity: 0.75, marginLeft: "0.3rem" }}>EUR</span>
            </div>
            {saving > 0 && (
              <div style={{ marginTop: "0.4rem", fontSize: "0.78rem", background: "rgba(255,255,255,0.15)", display: "inline-block", padding: "0.15rem 0.6rem" }}>
                {"-" + saving.toFixed(2) + " EUR nuo bazines kainos"}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.65, marginBottom: "0.4rem" }}>Bendra suma</div>
            <div style={{ fontFamily: "'Afacad',sans-serif", fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 700, lineHeight: 1 }}>
              {"~" + total.toLocaleString("lt-LT")}<span style={{ fontSize: "0.9rem", fontWeight: 400, opacity: 0.75, marginLeft: "0.3rem" }}>EUR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quantity display */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.8rem" }}>
        <div style={{ fontSize: "0.72rem", opacity: 0.45, letterSpacing: "0.08em", textTransform: "uppercase" }}>Kiekis</div>
        <div style={{ fontFamily: "'Afacad',sans-serif", fontSize: "1.6rem", fontWeight: 700, color: C.red }}>{qty.toLocaleString("lt-LT")} <span style={{ fontSize: "0.9rem", fontWeight: 400, opacity: 0.5, color: C.black }}>vnt</span></div>
      </div>

      {/* Slider */}
      <div style={{ marginBottom: "0.6rem" }}>
        <input type="range" className="price-slider"
          min={0} max={SLIDER_STEPS.length - 1} step={1}
          value={sliderIdx}
          onChange={e => setSliderIdx(parseInt(e.target.value))} />
      </div>

      {/* Min / Max labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
        <span style={{ fontSize: "0.72rem", opacity: 0.35 }}>500 vnt</span>
        <span style={{ fontSize: "0.72rem", opacity: 0.35 }}>10 000 vnt</span>
      </div>

      {/* Tier markers */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        {PRICE_TIERS.map((t, i) => {
          const active = qty >= t.qty && (i === PRICE_TIERS.length - 1 || qty < PRICE_TIERS[i + 1].qty);
          return (
            <button key={t.qty}
              onClick={() => setSliderIdx(SLIDER_STEPS.indexOf(t.qty))}
              style={{
                padding: "0.35rem 0.8rem", fontSize: "0.75rem", fontFamily: "'Afacad',sans-serif",
                border: "1.5px solid " + (active ? C.red : "rgba(0,0,0,0.12)"),
                background: active ? C.red : C.white,
                color: active ? C.white : C.black,
                cursor: "pointer", transition: "all 0.15s", fontWeight: active ? 600 : 400,
              }}>
              {t.label} â {t.price.toFixed(2)} EUR
              {t.popular && !active && <span style={{ marginLeft: "0.3rem", fontSize: "0.62rem", color: C.red, fontWeight: 600 }}>â</span>}
            </button>
          );
        })}
      </div>

      {/* Next tier nudge */}
      {nextTier && (
        <div style={{ background: C.pink, borderLeft: "3px solid " + C.red, padding: "0.8rem 1rem", marginBottom: "1.5rem", fontSize: "0.8rem", lineHeight: 1.5 }}>
          {"UÅ¾sisakykite "}
          <strong>{(nextTier.qty - qty).toLocaleString("lt-LT") + " vnt daugiau"}</strong>
          {" ir kaina kris iki "}
          <strong style={{ color: C.red }}>{nextTier.price.toFixed(2) + " EUR/vnt"}</strong>
          {" (sutaupote ~" + Math.round((pricePerUnit - nextTier.price) * nextTier.qty).toLocaleString("lt-LT") + " EUR)"}
        </div>
      )}

      <p style={{ fontSize: "0.72rem", opacity: 0.35, marginBottom: "1.5rem", lineHeight: 1.6 }}>
        Indikatyvi kaina formuluotei ir gamybai. Galutine kaina pateikiama po konsultacijos.
      </p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button className="btn ghost" onClick={onBack}>{"\u2190 Atgal"}</button>
        <button className="btn" onClick={confirm}>{"Testi \u2192"}</button>
      </div>
    </div>
  );
}

// ---- EUROVETROCAP PACKAGING CATALOG ----
// Mapped by product type compatibility
const PACKAGING_CATALOG = [
  // GLASS JARS
  { id:"laurence",    name:"LAURENCE",              type:"Stiklinis indelis",   material:"Stiklas",             sizes:["15ml","30ml","50ml","100ml","200ml"], tags:["kremas","indelis","stiklas"],       eco:false, note:"Klasikinis cilindrinis" },
  { id:"laurencefl",  name:"LAURENCE FLAT",          type:"Stiklinis indelis",   material:"Stiklas",             sizes:["15ml","30ml","50ml"],                 tags:["kremas","indelis","stiklas"],       eco:false, note:"PlokÅ¡Äias, elegantiÅ¡kas" },
  { id:"vittoria",    name:"VITTORIA",               type:"Stiklinis indelis",   material:"Stiklas",             sizes:["30ml","50ml","100ml"],                tags:["kremas","indelis","stiklas"],       eco:false, note:"Apvalus, klasikinis" },
  { id:"licata",      name:"LICATA",                 type:"Stiklinis indelis",   material:"Stiklas (90% perdirbtas)", sizes:["50ml","100ml","200ml"],          tags:["kremas","indelis","stiklas","eco"], eco:true,  note:"90% perdirbtas stiklas â ekologiÅ¡kas pasirinkimas" },
  { id:"giotto",      name:"GIOTTO",                 type:"Stiklinis indelis",   material:"Stiklas",             sizes:["30ml","50ml","100ml"],                tags:["kremas","indelis","stiklas"],       eco:false, note:"Modernios linijos" },
  { id:"boldjar",     name:"BOLD",                   type:"Stiklinis indelis",   material:"Stiklas",             sizes:["30ml","50ml","100ml","200ml"],        tags:["kremas","indelis","stiklas"],       eco:false, note:"StaÄiakampis, premium" },
  { id:"opale",       name:"OPALE",                  type:"Stiklinis indelis",   material:"Stiklas",             sizes:["30ml","50ml"],                        tags:["kremas","indelis","stiklas"],       eco:false, note:"Subtilaus dizaino" },
  // GLASS BOTTLES (cosmetics)
  { id:"makeup",      name:"MAKEUP",                 type:"Stiklinis buteliukas",material:"Stiklas",             sizes:["15ml","30ml","50ml"],                 tags:["serumas","aliejus","laÅ¡intuvas","stiklas"], eco:false, note:"KompaktiÅ¡kas, serumams" },
  { id:"laura1",      name:"LAURA",                  type:"Stiklinis buteliukas",material:"Stiklas",             sizes:["15ml","30ml","50ml","100ml","200ml"], tags:["serumas","tonikas","aliejus","stiklas"],    eco:false, note:"Universalus cilindrinis" },
  { id:"skin",        name:"SKIN",                   type:"Stiklinis buteliukas",material:"Stiklas",             sizes:["30ml","50ml","100ml"],                tags:["serumas","tonikas","stiklas"],      eco:false, note:"Å iuolaikiÅ¡kas dizainas" },
  { id:"boldbot",     name:"BOLD (buteliukas)",      type:"Stiklinis buteliukas",material:"Stiklas",             sizes:["15ml","30ml","50ml","100ml"],         tags:["serumas","aliejus","stiklas"],      eco:false, note:"StaÄiakampis, premium" },
  { id:"rita",        name:"RITA",                   type:"Stiklinis buteliukas",material:"Stiklas",             sizes:["30ml","50ml","100ml","200ml"],        tags:["serumas","losjonas","stiklas"],     eco:false, note:"ElegantiÅ¡kas, lieknas" },
  { id:"kless",       name:"KLESS",                  type:"Stiklinis buteliukas",material:"Stiklas",             sizes:["30ml","50ml","100ml","200ml"],        tags:["serumas","losjonas","stiklas"],     eco:false, note:"Å iuolaikiÅ¡kas profilis" },
  { id:"vogue",       name:"VOGUE",                  type:"Stiklinis buteliukas",material:"Stiklas",             sizes:["30ml","50ml","100ml"],                tags:["serumas","tonikas","stiklas"],     eco:false, note:"Kvadratinis, prabangus" },
  // PERFUME BOTTLES
  { id:"bazilleperf", name:"BAZILLE / BAZILLE RETRO",type:"KvepalÅ³ buteliukas",  material:"Stiklas",             sizes:["30ml","50ml","100ml"],                tags:["kvepalai","edp","edt"],             eco:false, note:"FEA15 â klasikinis" },
  { id:"penny",       name:"PENNY",                  type:"KvepalÅ³ buteliukas",  material:"Stiklas",             sizes:["30ml","50ml","100ml"],                tags:["kvepalai","edp","edt"],             eco:false, note:"FEA15 â apvalus" },
  { id:"picasso",     name:"PICASSO",                type:"KvepalÅ³ buteliukas",  material:"Stiklas",             sizes:["30ml","50ml","100ml"],                tags:["kvepalai","edp","edt"],             eco:false, note:"FEA15 â modernaus dizaino" },
  { id:"bruce",       name:"BRUCE",                  type:"KvepalÅ³ buteliukas",  material:"Stiklas",             sizes:["30ml","50ml","100ml"],                tags:["kvepalai","edp","edt"],             eco:false, note:"FEA15 â staÄiakampis" },
  { id:"signal",      name:"SIGNAL",                 type:"KvepalÅ³ buteliukas",  material:"Stiklas",             sizes:["50ml","100ml"],                       tags:["kvepalai","edp","edt"],             eco:false, note:"FEA15 â geometrinis" },
  { id:"victoria",    name:"VICTORIA",               type:"KvepalÅ³ buteliukas",  material:"Stiklas",             sizes:["50ml","100ml"],                       tags:["kvepalai","edp","edt"],             eco:false, note:"FEA15 â moteriÅ¡kas" },
  { id:"wood",        name:"WOOD",                   type:"KvepalÅ³ buteliukas",  material:"Stiklas + medis",     sizes:["50ml","100ml"],                       tags:["kvepalai","edp","edt"],             eco:false, note:"FEA15 â mediniai aksesuarai" },
  // HOME DIFFUSERS
  { id:"mystic",      name:"MYSTIC",                 type:"Difuzoriaus buteliukas",material:"Stiklas",           sizes:["100ml","200ml","500ml"],              tags:["difuzorius","namu"],                eco:false, note:"EU6 â klasikinis" },
  { id:"myka",        name:"MYKA",                   type:"Difuzoriaus buteliukas",material:"Stiklas",           sizes:["100ml","200ml"],                      tags:["difuzorius","namu"],                eco:false, note:"EU6 â modernus" },
  { id:"zen",         name:"ZENITH",                 type:"Difuzoriaus buteliukas",material:"Stiklas",           sizes:["100ml","200ml","500ml"],              tags:["difuzorius","namu"],                eco:false, note:"EU6 â minimalistinis" },
  { id:"themis",      name:"THEMIS",                 type:"Difuzoriaus buteliukas",material:"Stiklas",           sizes:["250ml","500ml"],                      tags:["difuzorius","namu"],                eco:false, note:"EU6 â didelio tÅ«rio" },
  // PLASTIC BOTTLES
  { id:"cilindroalt", name:"CILINDRO ALTO SLIM",     type:"Plastikinis buteliukas",material:"HDPE / PET",        sizes:["100ml","200ml","300ml","500ml"],      tags:["Å¡ampÅ«nas","losjonas","plastika"],   eco:false, note:"Cilindrinis â Å¡ampÅ«nams, losjonams" },
  { id:"sirioalto",   name:"SIRIO ALTO SLIM",        type:"Plastikinis buteliukas",material:"PET",               sizes:["100ml","200ml","300ml","500ml"],      tags:["Å¡ampÅ«nas","losjonas","plastika"],   eco:false, note:"PET â Å¡viesos ir lengvas" },
  { id:"mousse",      name:"MOUSSE",                 type:"Plastikinis buteliukas",material:"PP",                sizes:["150ml","200ml","250ml"],              tags:["putÅ³","Å¡ampÅ«nas","plastika"],       eco:false, note:"40SP â putos pompa" },
  { id:"boldplbot",   name:"BOLD (plastika)",        type:"Plastikinis buteliukas",material:"PP / PET",          sizes:["100ml","200ml"],                      tags:["losjonas","plastika"],              eco:false, note:"StaÄiakampis PP" },
  // PLASTIC JARS
  { id:"boldpljr",    name:"BOLD (plastikinis indelis)",type:"Plastikinis indelis",material:"PP",               sizes:["30ml","50ml","100ml","200ml"],        tags:["kremas","indelis","plastika"],      eco:false, note:"StaÄiakampis PP" },
  { id:"elsa",        name:"ELSA",                   type:"Plastikinis indelis",  material:"PP",                sizes:["30ml","50ml","100ml"],                tags:["kremas","indelis","plastika"],      eco:false, note:"Apvalus PP" },
  // AIRLESS
  { id:"parigiair",   name:"PARIGI AIRLESS",         type:"Airless buteliukas",   material:"PP (Airless)",       sizes:["15ml","30ml","50ml"],                 tags:["serumas","kremas","airless"],       eco:false, note:"Apsaugo nuo oksidacijos â aktyvÅ«s ingredientai" },
  { id:"elixirair",   name:"ELIXIR AIRLESS",         type:"Airless buteliukas",   material:"PP (Airless)",       sizes:["30ml","50ml"],                        tags:["serumas","kremas","airless"],       eco:false, note:"ElegantiÅ¡kas airless" },
  { id:"easyair",     name:"EASY AIRLESS",           type:"Airless buteliukas",   material:"PP (Airless)",       sizes:["30ml","50ml","100ml"],                tags:["serumas","kremas","airless"],       eco:false, note:"Universalus airless" },
  { id:"trentair",    name:"TRENT AIRLESS",          type:"Airless buteliukas",   material:"PP (Airless)",       sizes:["30ml","50ml","100ml"],                tags:["serumas","kremas","airless"],       eco:false, note:"Premium airless" },
  // ALUMINIUM
  { id:"alubot",      name:"Aliuminio buteliukas",   type:"Aliuminio buteliukas", material:"Aliuminis",          sizes:["50ml","100ml","150ml","200ml"],       tags:["losjonas","Å¡ampÅ«nas","aliuminis"],  eco:true,  note:"100% perdirbamas â tvarumo simbolis" },
  { id:"alujr",       name:"Aliuminio indelis",      type:"Aliuminio indelis",    material:"Aliuminis",          sizes:["15ml","30ml","50ml"],                 tags:["kremas","indelis","aliuminis"],     eco:true,  note:"100% perdirbamas â premium jausmas" },
];

// Smart packaging filter by product type
const getPackagingForProduct = (productType) => {
  const pt = productType.toLowerCase();
  const tagMap = {
    "serumas": ["serumas","airless","stiklas"],
    "kremas": ["kremas","indelis","airless"],
    "tonikas": ["serumas","tonikas","stiklas"],
    "veido aliejus": ["aliejus","serumas","stiklas"],
    "kaukÄ": ["kremas","indelis"],
    "akiu kremas": ["kremas","indelis","airless"],
    "kuno losjonas": ["losjonas","plastika","aliuminis"],
    "kuno sviestas": ["kremas","indelis"],
    "rankÅ³ kremas": ["kremas","indelis"],
    "lupÅ³ balzamas": ["kremas","indelis"],
    "eau de parfum": ["kvepalai","edp","edt"],
    "eau de toilette": ["kvepalai","edp","edt"],
    "kuno dulksna": ["losjonas","plastika"],
    "solid perfume": ["kremas","indelis"],
    "automobilinis kvapas": [],
    "Å¾vakÄ": [],
    "difuzorius (lazdelÄs)": ["difuzorius","namu"],
    "kambarinis purÅ¡kiklis": ["losjonas","plastika"],
    "patalynÄs purÅ¡kiklis": ["losjonas","plastika"],
    "aromatinis vaÅ¡kas": [],
    "Å¡ampÅ«nas": ["Å¡ampÅ«nas","plastika","aliuminis"],
    "kondicionierius": ["Å¡ampÅ«nas","plastika"],
    "plaukÅ³ serumas": ["serumas","stiklas","plastika"],
    "barzdos aliejus": ["aliejus","serumas","stiklas"],
    "barzdos balzamas": ["kremas","indelis"],
    "barzdos Å¡ampÅ«nas": ["Å¡ampÅ«nas","plastika"],
    "skutimosi puta": ["putÅ³","plastika"],
    "skutimosi gelis": ["losjonas","plastika"],
    "balzamas po skutimosi": ["losjonas","kremas","plastika"],
    "veido kremas": ["kremas","indelis","airless"],
    "Å¡ampÅ«nas Å¡unims": ["Å¡ampÅ«nas","plastika"],
    "Å¡ampÅ«nas katems": ["Å¡ampÅ«nas","plastika"],
  };

  let matchTags = [];
  for (const [key, tags] of Object.entries(tagMap)) {
    if (pt.includes(key) || key.includes(pt)) { matchTags = tags; break; }
  }
  if (!matchTags.length) matchTags = ["stiklas","plastika"];

  return PACKAGING_CATALOG.filter(p => p.tags.some(t => matchTags.includes(t)));
};

// Packaging price per unit based on type and ml size
const getPkgPrice = (type, ml) => {
  const size = parseInt(ml) || 50;
  const prices = {
    "Stiklinis indelis":      size <= 30 ? 0.45 : size <= 50 ? 0.55 : size <= 100 ? 0.70 : 0.90,
    "Stiklinis buteliukas":   size <= 30 ? 0.42 : size <= 50 ? 0.52 : size <= 100 ? 0.65 : 0.85,
    "KvepalÅ³ buteliukas":     size <= 30 ? 0.55 : size <= 50 ? 0.68 : 0.85,
    "Difuzoriaus buteliukas": size <= 100 ? 0.50 : size <= 200 ? 0.65 : 0.80,
    "Plastikinis buteliukas": size <= 100 ? 0.30 : size <= 200 ? 0.35 : 0.42,
    "Plastikinis indelis":    size <= 50 ? 0.30 : size <= 100 ? 0.38 : 0.45,
    "Airless buteliukas":     size <= 30 ? 0.65 : size <= 50 ? 0.78 : 0.92,
    "Aliuminio buteliukas":   size <= 100 ? 0.75 : size <= 150 ? 0.88 : 1.00,
    "Aliuminio indelis":      size <= 30 ? 0.70 : size <= 50 ? 0.85 : 1.00,
  };
  return prices[type] || 0.50;
};

// SVG illustrations for each packaging type
const PKG_SVG = {
  // Stiklinis indelis â wide cream jar with flat lid, subtle shoulder
  "Stiklinis indelis": (sel) => {
    const s = sel ? "#9F132D" : "#999";
    const f = sel ? "rgba(159,19,45,0.07)" : "rgba(180,180,180,0.12)";
    const shine = sel ? "rgba(159,19,45,0.18)" : "rgba(255,255,255,0.7)";
    return (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        {/* lid */}
        <rect x="16" y="10" width="48" height="13" rx="2" fill={f} stroke={s} strokeWidth="1.3"/>
        <rect x="18" y="10" width="6" height="13" rx="1" fill={shine} opacity="0.5"/>
        {/* lid rim */}
        <rect x="14" y="21" width="52" height="4" rx="1" fill={f} stroke={s} strokeWidth="1.1"/>
        {/* jar body */}
        <path d="M15 25 L15 68 Q15 72 19 72 L61 72 Q65 72 65 68 L65 25 Z" fill={f} stroke={s} strokeWidth="1.3"/>
        {/* shine strip */}
        <rect x="17" y="26" width="7" height="44" rx="2" fill={shine} opacity="0.4"/>
        {/* label area */}
        <rect x="22" y="35" width="36" height="22" rx="1" fill="none" stroke={s} strokeWidth="0.7" opacity="0.4"/>
      </svg>
    );
  },

  // Stiklinis buteliukas â tall serum bottle with dropper neck
  "Stiklinis buteliukas": (sel) => {
    const s = sel ? "#9F132D" : "#999";
    const f = sel ? "rgba(159,19,45,0.07)" : "rgba(180,180,180,0.12)";
    const shine = sel ? "rgba(159,19,45,0.18)" : "rgba(255,255,255,0.7)";
    return (
      <svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        {/* cap */}
        <rect x="31" y="5" width="18" height="14" rx="3" fill={sel?"rgba(159,19,45,0.2)":"rgba(120,120,120,0.2)"} stroke={s} strokeWidth="1.3"/>
        {/* neck */}
        <rect x="34" y="18" width="12" height="14" rx="1" fill={f} stroke={s} strokeWidth="1.1"/>
        {/* shoulder curve */}
        <path d="M27 32 Q24 36 24 42 L24 96 Q24 100 28 100 L52 100 Q56 100 56 96 L56 42 Q56 36 53 32 Z" fill={f} stroke={s} strokeWidth="1.3"/>
        {/* shine */}
        <rect x="26" y="42" width="6" height="52" rx="2" fill={shine} opacity="0.45"/>
        {/* label */}
        <rect x="30" y="52" width="24" height="28" rx="1" fill="none" stroke={s} strokeWidth="0.7" opacity="0.4"/>
      </svg>
    );
  },

  // KvepalÅ³ buteliukas â rectangular perfume flacon with spray collar
  "KvepalÅ³ buteliukas": (sel) => {
    const s = sel ? "#9F132D" : "#999";
    const f = sel ? "rgba(159,19,45,0.07)" : "rgba(180,180,180,0.12)";
    const shine = sel ? "rgba(159,19,45,0.18)" : "rgba(255,255,255,0.7)";
    return (
      <svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        {/* spray cap */}
        <rect x="28" y="5" width="24" height="16" rx="3" fill={sel?"rgba(159,19,45,0.2)":"rgba(100,100,100,0.18)"} stroke={s} strokeWidth="1.3"/>
        {/* spray collar */}
        <rect x="24" y="20" width="32" height="7" rx="1" fill={sel?"rgba(159,19,45,0.15)":"rgba(140,140,140,0.2)"} stroke={s} strokeWidth="1.1"/>
        {/* neck */}
        <rect x="33" y="26" width="14" height="7" rx="0" fill={f} stroke={s} strokeWidth="1.1"/>
        {/* body â slightly tapered top */}
        <path d="M20 33 L20 96 Q20 100 24 100 L56 100 Q60 100 60 96 L60 33 Z" fill={f} stroke={s} strokeWidth="1.3"/>
        {/* shine */}
        <rect x="22" y="34" width="7" height="62" rx="2" fill={shine} opacity="0.4"/>
        {/* label */}
        <rect x="26" y="46" width="28" height="32" rx="0" fill="none" stroke={s} strokeWidth="0.7" opacity="0.35"/>
      </svg>
    );
  },

  // Difuzoriaus buteliukas â round diffuser bottle with reed sticks
  "Difuzoriaus buteliukas": (sel) => {
    const s = sel ? "#9F132D" : "#999";
    const f = sel ? "rgba(159,19,45,0.07)" : "rgba(180,180,180,0.12)";
    return (
      <svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        {/* reed sticks */}
        <line x1="33" y1="4" x2="29" y2="26" stroke={s} strokeWidth="1.2" opacity="0.55"/>
        <line x1="38" y1="3" x2="38" y2="26" stroke={s} strokeWidth="1.2" opacity="0.55"/>
        <line x1="43" y1="3" x2="40" y2="26" stroke={s} strokeWidth="1.2" opacity="0.55"/>
        <line x1="48" y1="4" x2="47" y2="26" stroke={s} strokeWidth="1.2" opacity="0.55"/>
        {/* neck */}
        <rect x="33" y="22" width="14" height="12" rx="1" fill={f} stroke={s} strokeWidth="1.2"/>
        {/* collar */}
        <rect x="29" y="32" width="22" height="5" rx="1" fill={sel?"rgba(159,19,45,0.12)":"rgba(140,140,140,0.18)"} stroke={s} strokeWidth="1"/>
        {/* round body */}
        <ellipse cx="40" cy="72" rx="20" ry="28" fill={f} stroke={s} strokeWidth="1.3"/>
        {/* base flat */}
        <rect x="20" y="96" width="40" height="6" rx="2" fill={sel?"rgba(159,19,45,0.1)":"rgba(140,140,140,0.15)"} stroke={s} strokeWidth="1"/>
        {/* shine */}
        <ellipse cx="30" cy="62" rx="4" ry="10" fill="white" opacity={sel?0.25:0.4}/>
      </svg>
    );
  },

  // Plastikinis buteliukas â pump dispenser bottle (like shampoo)
  "Plastikinis buteliukas": (sel) => {
    const s = sel ? "#9F132D" : "#999";
    const f = sel ? "rgba(159,19,45,0.07)" : "rgba(180,180,180,0.12)";
    return (
      <svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        {/* pump head */}
        <rect x="34" y="6" width="18" height="8" rx="3" fill={sel?"rgba(159,19,45,0.2)":"rgba(120,120,120,0.2)"} stroke={s} strokeWidth="1.2"/>
        {/* pump tube */}
        <rect x="38" y="13" width="4" height="14" rx="1" fill={f} stroke={s} strokeWidth="1"/>
        {/* pump collar */}
        <rect x="30" y="25" width="20" height="6" rx="2" fill={sel?"rgba(159,19,45,0.12)":"rgba(140,140,140,0.18)"} stroke={s} strokeWidth="1.1"/>
        {/* body */}
        <path d="M21 31 L21 96 Q21 100 25 100 L55 100 Q59 100 59 96 L59 31 Z" fill={f} stroke={s} strokeWidth="1.3"/>
        {/* shine */}
        <rect x="23" y="32" width="7" height="64" rx="3" fill="white" opacity={sel?0.22:0.38}/>
        {/* label */}
        <rect x="27" y="44" width="26" height="30" rx="1" fill="none" stroke={s} strokeWidth="0.7" opacity="0.35"/>
      </svg>
    );
  },

  // Plastikinis indelis â wide plastic jar with screw lid
  "Plastikinis indelis": (sel) => {
    const s = sel ? "#9F132D" : "#999";
    const f = sel ? "rgba(159,19,45,0.07)" : "rgba(180,180,180,0.12)";
    return (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        {/* lid */}
        <rect x="15" y="9" width="50" height="14" rx="3" fill={sel?"rgba(159,19,45,0.14)":"rgba(160,160,160,0.2)"} stroke={s} strokeWidth="1.2"/>
        <rect x="17" y="9" width="7" height="14" rx="2" fill="white" opacity={sel?0.3:0.45}/>
        {/* rim */}
        <rect x="13" y="21" width="54" height="4" rx="1" fill={sel?"rgba(159,19,45,0.1)":"rgba(140,140,140,0.15)"} stroke={s} strokeWidth="1"/>
        {/* body */}
        <path d="M14 25 L14 67 Q14 71 18 71 L62 71 Q66 71 66 67 L66 25 Z" fill={f} stroke={s} strokeWidth="1.3"/>
        {/* shine */}
        <rect x="16" y="26" width="7" height="43" rx="2" fill="white" opacity={sel?0.22:0.4}/>
        {/* label */}
        <rect x="21" y="34" width="38" height="20" rx="1" fill="none" stroke={s} strokeWidth="0.7" opacity="0.35"/>
      </svg>
    );
  },

  // Airless buteliukas â airless pump bottle with visible piston line
  "Airless buteliukas": (sel) => {
    const s = sel ? "#9F132D" : "#999";
    const f = sel ? "rgba(159,19,45,0.07)" : "rgba(180,180,180,0.12)";
    return (
      <svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        {/* pump actuator */}
        <rect x="28" y="5" width="24" height="10" rx="3" fill={sel?"rgba(159,19,45,0.2)":"rgba(120,120,120,0.2)"} stroke={s} strokeWidth="1.2"/>
        {/* pump stem */}
        <rect x="37" y="14" width="6" height="12" rx="1" fill={f} stroke={s} strokeWidth="1"/>
        {/* collar */}
        <rect x="26" y="24" width="28" height="6" rx="2" fill={sel?"rgba(159,19,45,0.12)":"rgba(140,140,140,0.18)"} stroke={s} strokeWidth="1.1"/>
        {/* body */}
        <rect x="23" y="29" width="34" height="68" rx="4" fill={f} stroke={s} strokeWidth="1.3"/>
        {/* shine */}
        <rect x="25" y="30" width="7" height="66" rx="3" fill="white" opacity={sel?0.22:0.38}/>
        {/* piston line â key airless detail */}
        <line x1="23" y1="76" x2="57" y2="76" stroke={s} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5"/>
        {/* label */}
        <rect x="29" y="38" width="22" height="28" rx="1" fill="none" stroke={s} strokeWidth="0.7" opacity="0.35"/>
      </svg>
    );
  },

  // Aliuminio buteliukas â cylindrical alu bottle with rolled shoulder
  "Aliuminio buteliukas": (sel) => {
    const s = sel ? "#9F132D" : "#888";
    const f = sel ? "rgba(159,19,45,0.09)" : "rgba(160,160,160,0.18)";
    return (
      <svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        {/* cap */}
        <rect x="28" y="5" width="24" height="14" rx="4" fill={sel?"rgba(159,19,45,0.22)":"rgba(140,140,140,0.3)"} stroke={s} strokeWidth="1.3"/>
        {/* shoulder */}
        <path d="M28 19 Q24 22 24 28 L24 97 Q24 100 27 100 L53 100 Q56 100 56 97 L56 28 Q56 22 52 19 Z" fill={f} stroke={s} strokeWidth="1.3"/>
        {/* metallic shine â two strips for alu feel */}
        <rect x="26" y="28" width="5" height="68" rx="2" fill="white" opacity={sel?0.28:0.5}/>
        <rect x="49" y="28" width="3" height="68" rx="1" fill="white" opacity={sel?0.15:0.28}/>
        {/* seam line */}
        <line x1="40" y1="28" x2="40" y2="100" stroke={s} strokeWidth="0.5" opacity="0.2"/>
        {/* label band */}
        <rect x="27" y="46" width="26" height="28" rx="0" fill="none" stroke={s} strokeWidth="0.7" opacity="0.3"/>
      </svg>
    );
  },

  // Aliuminio indelis â wide alu jar
  "Aliuminio indelis": (sel) => {
    const s = sel ? "#9F132D" : "#888";
    const f = sel ? "rgba(159,19,45,0.09)" : "rgba(160,160,160,0.18)";
    return (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
        {/* lid */}
        <rect x="14" y="8" width="52" height="15" rx="4" fill={sel?"rgba(159,19,45,0.2)":"rgba(140,140,140,0.28)"} stroke={s} strokeWidth="1.3"/>
        <rect x="16" y="8" width="9" height="15" rx="3" fill="white" opacity={sel?0.28:0.48}/>
        {/* rim */}
        <rect x="12" y="21" width="56" height="4" rx="1" fill={sel?"rgba(159,19,45,0.1)":"rgba(140,140,140,0.2)"} stroke={s} strokeWidth="1"/>
        {/* body */}
        <rect x="13" y="24" width="54" height="46" rx="3" fill={f} stroke={s} strokeWidth="1.3"/>
        {/* alu shine */}
        <rect x="15" y="25" width="9" height="44" rx="2" fill="white" opacity={sel?0.28:0.46}/>
        <rect x="58" y="25" width="5" height="44" rx="1" fill="white" opacity={sel?0.15:0.28}/>
        {/* label */}
        <rect x="22" y="32" width="36" height="18" rx="0" fill="none" stroke={s} strokeWidth="0.7" opacity="0.3"/>
      </svg>
    );
  },
};

const getPkgSVG = (type, sel) => {
  const fn = PKG_SVG[type];
  if (fn) return fn(sel);
  const s = sel ? "#9F132D" : "#aaa";
  const f = sel ? "rgba(159,19,45,0.07)" : "rgba(180,180,180,0.12)";
  return (
    <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
      <rect x="20" y="15" width="40" height="70" rx="4" fill={f} stroke={s} strokeWidth="1.3"/>
      <rect x="22" y="16" width="7" height="68" rx="2" fill="white" opacity="0.35"/>
    </svg>
  );
};

function PackagingStep({ onBack, onNext, productType, packaging, setPackaging, selectedSizes, setSelectedSizes, qty }) {
  const suggestions = getPackagingForProduct(productType);
  const [filter, setFilter] = useState("visi");

  const types = ["visi", ...Array.from(new Set(suggestions.map(p => p.type)))];
  const filtered = filter === "visi" ? suggestions : suggestions.filter(p => p.type === filter);

  const togglePkg = (id) => {
    setPackaging(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    if (!selectedSizes[id]) {
      const pkg = PACKAGING_CATALOG.find(p => p.id === id);
      if (pkg) setSelectedSizes(prev => ({ ...prev, [id]: pkg.sizes[Math.floor(pkg.sizes.length / 2)] }));
    }
  };

  const setSize = (id, size, e) => {
    e.stopPropagation();
    setSelectedSizes(prev => ({ ...prev, [id]: size }));
  };

  // Total packaging cost for selected items
  const pkgTotal = packaging.reduce((sum, id) => {
    const pkg = PACKAGING_CATALOG.find(p => p.id === id);
    if (!pkg) return sum;
    const size = selectedSizes[id] || pkg.sizes[0];
    return sum + getPkgPrice(pkg.type, size) * (qty || 500);
  }, 0);

  return (
    <div className="fade">
      <p style={{ fontSize: "0.78rem", opacity: 0.4, marginBottom: "1.5rem", lineHeight: 1.6 }}>
        {"Pasirinkite pakuotes iÅ¡ Eurovetrocap katalogo (2026) ir pageidaujamÄ tÅ«rÄ¯. Laboratorija patikrins suderinamumÄ."}
      </p>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.8rem" }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: "0.3rem 0.8rem", fontSize: "0.75rem", fontFamily: "'Afacad',sans-serif",
            border: "1.5px solid " + (filter === t ? C.red : "rgba(0,0,0,0.12)"),
            background: filter === t ? C.red : C.white, color: filter === t ? C.white : C.black,
            cursor: "pointer", transition: "all 0.15s", fontWeight: filter === t ? 600 : 400,
          }}>{t}</button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: "2rem", textAlign: "center", opacity: 0.4, fontSize: "0.88rem" }}>
          {"Å iam produktui pakuoÄiÅ³ kataloge nÄra â laboratorija pasiÅ«lys variantus konsultacijos metu."}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: "0.8rem", marginBottom: "1.5rem" }}>
        {filtered.map(pkg => {
          const sel = packaging.includes(pkg.id);
          const activeSize = selectedSizes[pkg.id] || pkg.sizes[Math.floor(pkg.sizes.length / 2)];
          const unitPrice = getPkgPrice(pkg.type, activeSize);
          return (
            <div key={pkg.id} onClick={() => togglePkg(pkg.id)} style={{
              border: "1.5px solid " + (sel ? C.red : "rgba(0,0,0,0.1)"),
              background: sel ? C.pink : C.white,
              cursor: "pointer", transition: "all 0.18s",
              position: "relative", overflow: "hidden",
            }}>
              {pkg.eco && (
                <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "#2d7a3a", color: C.white, fontSize: "0.58rem", padding: "0.15rem 0.5rem", fontWeight: 700, letterSpacing: "0.06em", zIndex: 2 }}>ECO</div>
              )}
              {sel && (
                <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem", background: C.red, color: C.white, fontSize: "0.7rem", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, zIndex: 2 }}>{"â"}</div>
              )}

              {/* SVG */}
              <div style={{ height: "100px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.7rem 1.2rem", background: sel ? "rgba(159,19,45,0.04)" : "rgba(0,0,0,0.015)" }}>
                <div style={{ width: "55px", height: "85px" }}>
                  {getPkgSVG(pkg.type, sel)}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "0.6rem 0.85rem 0.85rem" }}>
                <div style={{ fontSize: "0.58rem", color: C.red, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.2rem" }}>{pkg.type}</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.15rem", lineHeight: 1.2 }}>{pkg.name}</div>
                <div style={{ fontSize: "0.68rem", opacity: 0.42, marginBottom: "0.5rem" }}>{pkg.material}</div>

                {/* Size selector */}
                <div style={{ marginBottom: "0.5rem" }}>
                  <div style={{ fontSize: "0.62rem", opacity: 0.45, marginBottom: "0.3rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>TÅ«ris</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.2rem" }}>
                    {pkg.sizes.map(s => {
                      const isActive = activeSize === s;
                      return (
                        <button key={s} onClick={(e) => setSize(pkg.id, s, e)} style={{
                          fontSize: "0.65rem", padding: "0.15rem 0.4rem",
                          border: "1px solid " + (isActive ? C.red : "rgba(0,0,0,0.15)"),
                          background: isActive ? C.red : "transparent",
                          color: isActive ? C.white : C.black,
                          cursor: "pointer", fontFamily: "'Afacad',sans-serif",
                          fontWeight: isActive ? 700 : 400, transition: "all 0.15s",
                        }}>{s}</button>
                      );
                    })}
                  </div>
                </div>

                {/* Price per unit */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "0.4rem", marginTop: "0.2rem" }}>
                  <div style={{ fontSize: "0.62rem", opacity: 0.4 }}>vnt. kaina</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: sel ? C.red : C.black }}>
                    {"~" + unitPrice.toFixed(2) + " EUR"}
                  </div>
                </div>

                {pkg.note && <div style={{ marginTop: "0.35rem", fontSize: "0.62rem", opacity: 0.35, lineHeight: 1.4 }}>{pkg.note}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live packaging total */}
      {packaging.length > 0 && (
        <div style={{ background: C.black, color: C.white, padding: "1rem 1.3rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.8rem" }}>
          <div>
            <div style={{ fontSize: "0.62rem", opacity: 0.5, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.2rem" }}>Pasirinktos pakuotÄs</div>
            <div style={{ fontSize: "0.82rem", opacity: 0.75 }}>{packaging.map(id => {
              const pkg = PACKAGING_CATALOG.find(p => p.id === id);
              const sz = selectedSizes[id] || (pkg && pkg.sizes[0]);
              return pkg ? pkg.name + " " + sz : "";
            }).filter(Boolean).join(", ")}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.62rem", opacity: 0.5, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.2rem" }}>PakuotÄ viso</div>
            <div style={{ fontSize: "1.3rem", fontWeight: 700, color: C.pinkMid }}>{"~" + Math.round(pkgTotal).toLocaleString("lt-LT") + " EUR"}</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "1rem" }}>
        <button className="btn ghost" onClick={onBack}>{"â Atgal"}</button>
        <button className="btn" onClick={onNext}>{packaging.length > 0 ? "Testi â" : "Praleisti â"}</button>
      </div>
    </div>
  );
}

// ---- EARNINGS CALCULATOR COMPONENT ----
function EarningsCalc({ costPerUnit, qty, packaging, selectedSizes }) {
  const formulaCost = costPerUnit || 5.50;   // the very lab: R&D + gamyba
  const totalQty = qty || 500;

  // Packaging cost per unit (avg of selected, or fallback 0.55)
  const pkgCostPerUnit = (() => {
    if (!packaging || packaging.length === 0) return 0.55;
    const total = packaging.reduce((sum, id) => {
      const pkg = PACKAGING_CATALOG.find(p => p.id === id);
      if (!pkg) return sum;
      const sz = (selectedSizes && selectedSizes[id]) || pkg.sizes[0];
      return sum + getPkgPrice(pkg.type, sz);
    }, 0);
    return total / packaging.length;
  })();

  const labelCost = 0.20;  // etiketÄ: ~0.15â0.30 EUR/vnt

  const fullCost = formulaCost + pkgCostPerUnit + labelCost;

  const [sellPrice, setSellPrice] = React.useState(25);

  const margin = sellPrice - fullCost;
  const marginPct = Math.round((margin / sellPrice) * 100);
  const totalProfit = Math.round(margin * totalQty);
  const totalRevenue = Math.round(sellPrice * totalQty);
  const roi = Math.round(((totalProfit) / (fullCost * totalQty)) * 100);

  // Segment label
  const segment = sellPrice <= 18 ? "Masinis / FMCG"
    : sellPrice <= 30 ? "Vidutinis segmentas"
    : sellPrice <= 50 ? "Premiumo linija"
    : sellPrice <= 75 ? "AukÅ¡tas segmentas"
    : "Luxury / Niche";

  const segColor = sellPrice <= 18 ? "#888"
    : sellPrice <= 30 ? "#b07d3a"
    : sellPrice <= 50 ? C.red
    : sellPrice <= 75 ? "#7a2d8c"
    : "#1a1a1a";

  const sliderStyle = `
    .earn-slider { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:2px; outline:none; cursor:pointer; }
    .earn-slider::-webkit-slider-thumb { -webkit-appearance:none; width:26px; height:26px; border-radius:50%; background:${C.red}; cursor:pointer; border:3px solid white; box-shadow:0 2px 8px rgba(159,19,45,0.3); }
    .earn-slider::-moz-range-thumb { width:26px; height:26px; border-radius:50%; background:${C.red}; cursor:pointer; border:3px solid white; }
  `;

  const fillPct = ((sellPrice - 15) / (100 - 15)) * 100;

  return (
    <div style={{ marginTop:"2.5rem" }}>
      <style>{sliderStyle}</style>

      {/* Section header */}
      <div style={{ background:C.black, color:C.white, padding:"1.4rem 1.8rem", marginBottom:"0" }}>
        <div style={{ fontSize:"0.62rem", letterSpacing:"0.18em", textTransform:"uppercase", opacity:0.5, marginBottom:"0.4rem" }}>Potencialus uÅ¾darbis</div>
        <div style={{ fontFamily:"'Afacad',sans-serif", fontSize:"1.4rem", fontWeight:700, lineHeight:1.1 }}>
          Kiek galite uÅ¾dirbti?
        </div>
        <div style={{ fontSize:"0.82rem", opacity:0.55, marginTop:"0.4rem" }}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem 1.4rem", marginTop:"0.6rem" }}>
            <span style={{ fontSize:"0.78rem", opacity:0.7 }}>
              {"Gamyba (the very lab): "}
              <strong style={{ color:C.pinkMid }}>{formulaCost.toFixed(2) + " EUR"}</strong>
            </span>
            <span style={{ fontSize:"0.78rem", opacity:0.5 }}>{"+"}</span>
            <span style={{ fontSize:"0.78rem", opacity:0.7 }}>
              {"PakuotÄ (EVC): "}
              <strong style={{ color:"rgba(255,255,255,0.85)" }}>{pkgCostPerUnit.toFixed(2) + " EUR"}</strong>
            </span>
            <span style={{ fontSize:"0.78rem", opacity:0.5 }}>{"+"}</span>
            <span style={{ fontSize:"0.78rem", opacity:0.7 }}>
              {"EtiketÄ: "}
              <strong style={{ color:"rgba(255,255,255,0.85)" }}>{labelCost.toFixed(2) + " EUR"}</strong>
            </span>
            <span style={{ fontSize:"0.78rem", opacity:0.5 }}>{"="}</span>
            <span style={{ fontSize:"0.78rem", fontWeight:700, color:C.white }}>
              {"Viso: ~" + fullCost.toFixed(2) + " EUR/vnt"}
            </span>
          </div>
          <div style={{ fontSize:"0.75rem", opacity:0.45, marginTop:"0.4rem" }}>
            {totalQty.toLocaleString("lt-LT") + " vnt partija"}
          </div>
        </div>
      </div>

      <div style={{ background:C.white, border:"1.5px solid rgba(0,0,0,0.08)", padding:"1.8rem" }}>

        {/* Slider */}
        <div style={{ marginBottom:"2rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"0.8rem" }}>
            <div style={{ fontSize:"0.72rem", letterSpacing:"0.08em", textTransform:"uppercase", opacity:0.5 }}>Pardavimo kaina</div>
            <div style={{ fontFamily:"'Afacad',sans-serif", fontSize:"2.2rem", fontWeight:700, color:C.red, lineHeight:1 }}>
              {sellPrice} <span style={{ fontSize:"1rem", fontWeight:400, opacity:0.6 }}>EUR</span>
            </div>
          </div>
          <input
            type="range"
            className="earn-slider"
            min={15} max={100} step={1}
            value={sellPrice}
            onChange={e => setSellPrice(parseInt(e.target.value))}
            style={{ background: "linear-gradient(to right, " + C.red + " " + fillPct + "%, rgba(0,0,0,0.1) " + fillPct + "%)" }}
          />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.4rem" }}>
            <span style={{ fontSize:"0.7rem", opacity:0.35 }}>15 EUR</span>
            <span style={{ fontSize:"0.7rem", opacity:0.35 }}>100 EUR</span>
          </div>
        </div>

        {/* Segment badge */}
        <div style={{ display:"inline-block", padding:"0.3rem 0.9rem", background:segColor, color:C.white, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"1.8rem" }}>
          {segment}
        </div>

        {/* Key metrics grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"0.8rem", marginBottom:"1.8rem" }}>
          <div style={{ padding:"1.1rem", background:margin > 0 ? "rgba(45,122,58,0.06)" : "rgba(159,19,45,0.06)", border:"1.5px solid " + (margin > 0 ? "rgba(45,122,58,0.2)" : C.red) }}>
            <div style={{ fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", opacity:0.5, marginBottom:"0.3rem" }}>Pelnas / vnt</div>
            <div style={{ fontFamily:"'Afacad',sans-serif", fontSize:"1.6rem", fontWeight:700, color: margin > 0 ? "#2d7a3a" : C.red, lineHeight:1 }}>
              {margin > 0 ? "+" : ""}{margin.toFixed(2)} <span style={{ fontSize:"0.85rem", fontWeight:400, opacity:0.7 }}>EUR</span>
            </div>
            <div style={{ fontSize:"0.72rem", opacity:0.45, marginTop:"0.3rem" }}>{"MarÅ¾a " + marginPct + "%"}</div>
          </div>

          <div style={{ padding:"1.1rem", background:"rgba(159,19,45,0.05)", border:"1.5px solid rgba(159,19,45,0.15)" }}>
            <div style={{ fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", opacity:0.5, marginBottom:"0.3rem" }}>Bendra apyvarta</div>
            <div style={{ fontFamily:"'Afacad',sans-serif", fontSize:"1.6rem", fontWeight:700, color:C.red, lineHeight:1 }}>
              {"~" + totalRevenue.toLocaleString("lt-LT")} <span style={{ fontSize:"0.85rem", fontWeight:400, opacity:0.7 }}>EUR</span>
            </div>
            <div style={{ fontSize:"0.72rem", opacity:0.45, marginTop:"0.3rem" }}>{totalQty.toLocaleString("lt-LT") + " vnt x " + sellPrice + " EUR"}</div>
          </div>

          <div style={{ padding:"1.1rem", background: totalProfit > 0 ? "rgba(45,122,58,0.06)" : "rgba(159,19,45,0.06)", border:"1.5px solid " + (totalProfit > 0 ? "rgba(45,122,58,0.2)" : C.red) }}>
            <div style={{ fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", opacity:0.5, marginBottom:"0.3rem" }}>Grynasis pelnas</div>
            <div style={{ fontFamily:"'Afacad',sans-serif", fontSize:"1.6rem", fontWeight:700, color: totalProfit > 0 ? "#2d7a3a" : C.red, lineHeight:1 }}>
              {"~" + totalProfit.toLocaleString("lt-LT")} <span style={{ fontSize:"0.85rem", fontWeight:400, opacity:0.7 }}>EUR</span>
            </div>
            <div style={{ fontSize:"0.72rem", opacity:0.45, marginTop:"0.3rem" }}>{"ROI " + roi + "%"}</div>
          </div>

          <div style={{ padding:"1.1rem", background:"rgba(0,0,0,0.02)", border:"1.5px solid rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", opacity:0.5, marginBottom:"0.3rem" }}>Investicija</div>
            <div style={{ fontFamily:"'Afacad',sans-serif", fontSize:"1.6rem", fontWeight:700, lineHeight:1 }}>
              {"~" + Math.round(fullCost * totalQty).toLocaleString("lt-LT")} <span style={{ fontSize:"0.85rem", fontWeight:400, opacity:0.7 }}>EUR</span>
            </div>
            <div style={{ fontSize:"0.72rem", opacity:0.45, marginTop:"0.3rem" }}>{"Pilna partijos kaina"}</div>
            <div style={{ marginTop:"0.6rem", fontSize:"0.7rem", lineHeight:1.8, opacity:0.55 }}>
              <div>{"Gamyba: " + Math.round(formulaCost * totalQty).toLocaleString("lt-LT") + " EUR"}</div>
              <div>{"PakuotÄ: " + Math.round(pkgCostPerUnit * totalQty).toLocaleString("lt-LT") + " EUR"}</div>
              <div>{"EtiketÄ: " + Math.round(labelCost * totalQty).toLocaleString("lt-LT") + " EUR"}</div>
            </div>
          </div>
        </div>

        {/* Break-even info */}
        {margin > 0 && (
          <div style={{ background:C.cream, border:"1.5px solid rgba(0,0,0,0.08)", padding:"1rem 1.2rem", marginBottom:"1.5rem", fontSize:"0.82rem", lineHeight:1.7 }}>
            <strong>{"Break-even: "}</strong>
            {Math.ceil((fullCost * totalQty) / margin).toLocaleString("lt-LT") + " vnt"}
            {" â parduokite tiek ir susigrÄÅ¾inate visÄ investicijÄ."}
          </div>
        )}

        {/* Price range examples */}
        <div style={{ marginBottom:"1.5rem" }}>
          <div style={{ fontSize:"0.68rem", letterSpacing:"0.1em", textTransform:"uppercase", opacity:0.4, marginBottom:"0.8rem" }}>Rinkos pavyzdÅ¾iai</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
            {[
              { label:"Masinis / FMCG", range:"15â18 EUR", margin:"~6â9 EUR/vnt", color:"#888" },
              { label:"Vidutinis segmentas", range:"20â30 EUR", margin:"~11â21 EUR/vnt", color:"#b07d3a" },
              { label:"Premium linija", range:"35â50 EUR", margin:"~26â41 EUR/vnt", color:C.red },
              { label:"AukÅ¡tas segmentas", range:"55â75 EUR", margin:"~46â66 EUR/vnt", color:"#7a2d8c" },
              { label:"Luxury / Niche", range:"80â100+ EUR", margin:"~71â91+ EUR/vnt", color:"#1a1a1a" },
            ].map((row, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.8rem", padding:"0.5rem 0.8rem", background: sellPrice >= [15,20,35,55,80][i] && sellPrice < [19,35,55,80,101][i] ? row.color + "12" : "transparent", borderLeft: "3px solid " + (sellPrice >= [15,20,35,55,80][i] && sellPrice < [19,35,55,80,101][i] ? row.color : "transparent"), transition:"all 0.2s" }}>
                <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:row.color, flexShrink:0 }} />
                <div style={{ flex:1, fontSize:"0.78rem", fontWeight: sellPrice >= [15,20,35,55,80][i] && sellPrice < [19,35,55,80,101][i] ? 700 : 400 }}>{row.label}</div>
                <div style={{ fontSize:"0.78rem", opacity:0.6 }}>{row.range}</div>
                <div style={{ fontSize:"0.75rem", color:row.color, fontWeight:600 }}>{row.margin}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Shelf life highlight */}
        <div style={{ background:C.red, color:C.white, padding:"1rem 1.3rem", display:"flex", gap:"1.2rem", alignItems:"center" }}>
          <div style={{ fontSize:"2rem", opacity:0.85, flexShrink:0 }}>{"â±"}</div>
          <div>
            <div style={{ fontWeight:700, fontSize:"0.95rem", marginBottom:"0.2rem" }}>{"2 metÅ³ galiojimas"}</div>
            <div style={{ fontSize:"0.78rem", opacity:0.75, lineHeight:1.5 }}>
              {"Visos the very lab formuluotÄs atitinka ES reikalavimus ir turi " }
              <strong>{"24 mÄnesiÅ³ tinkamumo laikotarpÄ¯"}</strong>
              {". Pakankamai laiko parduoti visÄ partijÄ ir planuoti pakartotinÄ¯ uÅ¾sakymÄ."}
            </div>
          </div>
        </div>

      </div>

      {/* Fine print */}
      <div style={{ padding:"0.8rem 0", fontSize:"0.7rem", opacity:0.3, lineHeight:1.6 }}>
        {"* SkaiÄiavimai indikatyvÅ«s. Gamyba = the very lab R&D + gamyba. PakuotÄ = Eurovetrocap indikatyvi kaina. EtiketÄ = ~0.20 EUR/vnt. NeÄ¯skaiÄiuoti: logistika, mokesÄiai, prekybos tinklo marÅ¾a."}
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ cat: "", type: "", skin: [], effects: [], avoid: [], brief: "" });
  const [pricing, setPricing] = useState({ qty: 0, pricePerUnit: 0, total: 0 });
  const [packaging, setPackaging] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const topRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if (result && resultRef.current) resultRef.current.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  const ctx = () => PRODUCT_CONTEXT[form.type] || DEFAULT_SKIN[form.cat] || DEFAULT_SKIN.women;
  const isFH = form.cat === "fragrance" || form.cat === "home";

  const toggle = (field, val) => setForm(f => ({
    ...f, [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val]
  }));

  const selectCat = (id) => {
    setForm(f => ({ ...f, cat: id, type: "", skin: [], effects: [] }));
    setTimeout(() => setStep(1), 200);
  };

  const selectType = (t) => setForm(f => ({ ...f, type: t, skin: [], effects: [] }));

  const canNext = () => {
    if (step === 1) return form.type !== "";
    if (step === 2) return form.skin.length > 0;
    if (step === 3) return form.effects.length > 0;
    return true;
  };

  const catLabel = () => (CATEGORIES.find(x => x.id === form.cat) || {}).label || "";
  const SLABELS = ["","Produkto tipas","","Efektai","Ingredientai","Kiekis ir kaina","Pakuote (EVC)","Papildoma info"];
  const stepLabel = () => step === 2 ? ctx().skinLabel : (SLABELS[step] || "");
  const pct = step === 0 ? 0 : step >= 8 ? 100 : ((step - 1) / 7) * 100;

  const MOCK_RESULTS = {
    default: `RECEPTUROS KRYPTIS
Å i formuluotÄ sukurta specialiai ${"{form.type}"} produktui, atsiÅ¾velgiant Ä¯ pasirinktus parametrus. BazÄ suformuluota taip, kad uÅ¾tikrintÅ³ optimalÅ³ aktyviÅ³ ingredientÅ³ veikimÄ ir maloniÄ tekstÅ«rÄ.

AKTYVIEJI INGREDIENTAI
- Niacinamide (Niacinamide) 5% â porÅ³ maÅ¾inimas, odos tono lyginimas, raminantis poveikis
- Hyaluronic Acid (Sodium Hyaluronate) 2% â intensyvus drÄkinimas, odos elastingumas
- Vitamin C (Ascorbyl Glucoside) 3% â antioksidantinis poveikis, Å¡viesinimas
- Panthenol (Panthenol) 1% â odos barjero stiprinimas, regeneracija
- Allantoin (Allantoin) 0.5% â raminimas, odos minkÅ¡tinimas

BAZINIAI INGREDIENTAI
- Aqua â pagrindas, tirpiklis (60-70%)
- Glycerin â humektantas, drÄkinimas (5-8%)
- Cetearyl Alcohol â emolientas, tekstÅ«ros stabilizavimas (3-5%)
- Phenoxyethanol & Ethylhexylglycerin â konservantas (1%)

KONCENTRACIJA
Vandens fazÄ: 70% / AliejinÄ fazÄ: 15% / Aktyvieji: 12% / Papildomi: 3%

REGULIACINÄS PASTABOS
FormuluotÄ atitinka ES kosmetikos reglamentÄ (EC) Nr. 1223/2009. Rekomenduojama CPNP notifikacija prieÅ¡ iÅ¡leidimÄ Ä¯ ES rinkÄ. pH 5.5â6.0.

IÅ SKIRTINUMAS
Unikalus derinio variantas â âtriple moisture lock" koncepcija su trimis drÄkinimo mechanizmais (humektantas + emolientas + okluzija), suteikiantis ilgalaikÄ¯ drÄkinimo efektÄ be lipnaus jausmo.`,

    fragrance: `FORMULAVIMO KRYPTIS
Å is kvapas sukurtas kaip modernus unisex aromatas su mediniu-gÄliniu charakteriu. FormuluotÄ orientuota Ä¯ ilgalaikÄ¯ iÅ¡laikumÄ ir malonÅ³ drydown procesÄ.

KVAPINÄS NATOS
VirÅ¡utinÄs natos (0â30 min): Bergamotas, RoÅ¾inÄ citrina, Kardamonas
Å irdies natos (30 min â 4 val): RoÅ¾Ä, Cedras, Irisas, Å½alysis arbatos lapas
BazinÄs natos (4+ val): Sandalmedis, Muskusas, Ambra, PaÄulis

REKOMENDUOJAMOS Å½ALIAVOS
- Bergamot FCF (IFF / Givaudan) â Å¡vieÅ¾ia citrusinÄ nata be fototoksiÅ¡kumo
- Rose absolute Maroko â Å¡irdies nota, premium kokybÄ
- Sandalwood Mysore (Symrise) â Å¡ilta bazinÄ nota, ilgas iÅ¡laikumas
- Ambroxan (Firmenich) â moderni ambros nota, unisex

KONCENTRACIJA
EDP: parfumerinÄ kompozicija 18â22% / Alkoholis 96% / Aqua (stabilizatorius)

REGULIACINÄS PASTABOS
IFRA 49 atitiktis bÅ«tina. FototoksiÅ¡ki ingredientai (bergamotas) turi bÅ«ti FCF versijos. EU Allergens sÄraÅ¡as â privaloma deklaracija ant etiketÄs.

IÅ SKIRTINUMAS
âClean luxury" pozicionavimas â sintetiniai muskusai pakeiÄiami natÅ«raliais alternatyvais, kas leidÅ¾ia komunikuoti tvarumÄ neprarandant prabangios patirties.`,

    home: `FORMULAVIMO KRYPTIS
NamÅ³ kvapas sukurtas erdvei suteikti Å¡iltÄ, jaukiÄ atmosferÄ. FormuluotÄ optimizuota stipriam kvapÅ³ skleidimui ir ilgalaikiam poveikiui.

KVAPINÄS NATOS
VirÅ¡utinÄs natos: Bergamotas, Eukaliptas, Citrusiniai vaisiai
Å irdies natos: Lavendas, Rozmarinas, Balti Å¾iedai
BazinÄs natos: CedrÅ³ medis, Tonkos pupelÄ, Muskusas, VanilÄ

REKOMENDUOJAMOS Å½ALIAVOS
- Lavender 40/42 (essential oil) â raminanti, universali nota
- Tonka bean absolute â Å¡ilta, saldi bazÄ
- Cedar Virginian (essential oil) â mediÅ¡ka bazÄ, ilgas iÅ¡laikumas
- Fragrance load 10-12% â optimali koncentracija difuzoriams

KONCENTRACIJA
ParfumerinÄ kompozicija: 10â15% / DPG (dipropylene glycol) tirpiklis: 85â90%

REGULIACINÄS PASTABOS
CLP reglamentas (EC) Nr. 1272/2008 â privaloma GHS etiketÄ. IFRA atitiktis namÅ³ kvapams. Ugnies saugos reikalavimai Å¾vakÄms (EN 15493/15494).

IÅ SKIRTINUMAS
âSkandinaviÅ¡ko minimalizmo" koncepcija â Å¡varÅ«s, nepertekliniai kvapai su mediniu pagrindu, atspindintys tvarumo ir natÅ«ralumo vertybes.`
  };

  const submit = async () => {
    setLoading(true); setError(null); setResult(null);

    // DEMO MODE â mock atsakymas be API
    await new Promise(r => setTimeout(r, 1800)); // simuliuojam loading
    const isFrag = form.cat === "fragrance";
    const isHome = form.cat === "home";
    let mockText = isFrag ? MOCK_RESULTS.fragrance : isHome ? MOCK_RESULTS.home : MOCK_RESULTS.default;
    // Personalizuojam pagal pasirinktus parametrus
    mockText = mockText.replace("${form.type}", form.type || "produktui");
    setResult(mockText);
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

  return (
    <div style={{ minHeight:"100vh", background:C.cream, fontFamily:"'Afacad',sans-serif", color:C.black }} ref={topRef}>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <div style={{ fontFamily:"'Afacad',sans-serif", fontWeight:600, fontSize:"1rem", letterSpacing:"0.02em", color:C.black }}>
          the very lab
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
          <div style={{ fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", background:"#f59e0b", color:"#000", padding:"0.2rem 0.6rem", fontWeight:700 }}>DEMO</div>
          {step > 0 && step < 8 && (
            <button onClick={reset} style={{background:"none",border:"none",cursor:"pointer",fontSize:"0.75rem",color:C.red,letterSpacing:"0.06em",textTransform:"uppercase",fontFamily:"'Afacad',sans-serif",fontWeight:500}}>
              iÅ¡ naujo
            </button>
          )}
        </div>
      </nav>

      {/* HERO */}
      {step === 0 && (
        <div style={{ background:C.red, padding:"4rem 2rem 3.5rem", textAlign:"center" }}>
          <div style={{ maxWidth:"600px", margin:"0 auto" }}>
            <p style={{ fontSize:"0.72rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.6)", marginBottom:"1rem" }}>Private Label Kosmetikos Laboratorija</p>
            <h1 style={{ fontFamily:"'Afacad',sans-serif", fontSize:"clamp(2.2rem,6vw,3.5rem)", fontWeight:700, color:C.white, lineHeight:1.1, marginBottom:"1.2rem", letterSpacing:"-0.01em" }}>
              Sukurkite savo<br />receptÅ«ros kryptÄ¯
            </h1>
            <p style={{ fontSize:"1rem", color:"rgba(255,255,255,0.7)", lineHeight:1.6, maxWidth:"420px", margin:"0 auto" }}>
              Atsakykite Ä¯ kelis klausimus ir gaukite AI parengtÄ formulavimo kryptÄ¯ bei indikatyviÄ kainÄ.
            </p>
          </div>
        </div>
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

        {/* STEP 0: Categories */}
        {step === 0 && (
          <div className="fade">
            <p style={{ fontSize:"0.72rem", letterSpacing:"0.12em", textTransform:"uppercase", color:C.red, fontWeight:600, marginBottom:"0.6rem" }}>01 / Pasirinkite kategorijÄ</p>
            <h2 style={{ fontSize:"1.6rem", fontWeight:700, marginBottom:"2rem", lineHeight:1.2 }}>Kokios kategorijos produktÄ kuriate?</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:"0.8rem" }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} className={"catcard"+(form.cat===cat.id?" sel":"")} onClick={()=>selectCat(cat.id)}>
                  <div style={{ fontSize:"1.4rem", marginBottom:"0.7rem", color:C.red, opacity:0.7 }}>{cat.icon}</div>
                  <div style={{ fontSize:"1.1rem", fontWeight:700, marginBottom:"0.25rem" }}>{cat.label}</div>
                  <div style={{ fontSize:"0.72rem", opacity:0.4, lineHeight:1.4 }}>{cat.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Product type */}
        {step === 1 && (
          <div className="fade">
            <h2 style={{ fontSize:"1.5rem", fontWeight:700, marginBottom:"1.8rem" }}>Kokio tipo produktÄ kuriate?</h2>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.55rem", marginBottom:"2rem" }}>
              {(PRODUCTS_BY_CAT[form.cat]||[]).map(t => (
                <button key={t} className={"chip"+(form.type===t?" sel":"")} onClick={()=>selectType(t)}>{t}</button>
              ))}
            </div>
            {form.type && (
              <div style={{ marginBottom:"1.5rem", padding:"0.75rem 1rem", background:C.pink, fontSize:"0.78rem", borderLeft:"3px solid "+C.red }}>
                {"Kitas Å¾ingsnis: "}<strong>{ctx().skinLabel}</strong>
              </div>
            )}
            <div style={{ display:"flex", gap:"1rem" }}>
              <button className="btn ghost" onClick={()=>setStep(0)}>{"\u2190 Atgal"}</button>
              <button className="btn" disabled={!canNext()} onClick={()=>setStep(2)}>{"Testi \u2192"}</button>
            </div>
          </div>
        )}

        {/* STEP 2: Skin/hair/scent */}
        {step === 2 && (
          <div className="fade">
            <h2 style={{ fontSize:"1.5rem", fontWeight:700, marginBottom:"0.5rem" }}>{ctx().skinLabel}</h2>
            <p style={{ fontSize:"0.82rem", opacity:0.5, marginBottom:"1.8rem" }}>Galima pasirinkti kelis</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.55rem", marginBottom:"3rem" }}>
              {(ctx().skinOptions||[]).map(t => (
                <button key={t} className={"chip"+(form.skin.includes(t)?" sel":"")} onClick={()=>toggle("skin",t)}>{t}</button>
              ))}
            </div>
            <div style={{ display:"flex", gap:"1rem" }}>
              <button className="btn ghost" onClick={()=>setStep(1)}>{"\u2190 Atgal"}</button>
              <button className="btn" disabled={!canNext()} onClick={()=>setStep(3)}>{"Testi \u2192"}</button>
            </div>
          </div>
        )}

        {/* STEP 3: Effects */}
        {step === 3 && (
          <div className="fade">
            <h2 style={{ fontSize:"1.5rem", fontWeight:700, marginBottom:"0.5rem" }}>{isFH ? "Pageidaujamos savybÄs" : "Norimi efektai"}</h2>
            <p style={{ fontSize:"0.82rem", opacity:0.5, marginBottom:"1.8rem" }}>Pasirinkite iki 3</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.55rem", marginBottom:"3rem" }}>
              {(ctx().effectOptions||[]).map(t => (
                <button key={t}
                  className={"chip"+(form.effects.includes(t)?" sel":"")+((!form.effects.includes(t)&&form.effects.length>=3)?" dim":"")}
                  onClick={()=>{ if(!form.effects.includes(t)&&form.effects.length>=3) return; toggle("effects",t); }}>{t}</button>
              ))}
            </div>
            <div style={{ display:"flex", gap:"1rem" }}>
              <button className="btn ghost" onClick={()=>setStep(2)}>{"\u2190 Atgal"}</button>
              <button className="btn" disabled={!canNext()} onClick={()=>setStep(4)}>{"Testi \u2192"}</button>
            </div>
          </div>
        )}

        {/* STEP 4: Avoid */}
        {step === 4 && (
          <div className="fade">
            <h2 style={{ fontSize:"1.5rem", fontWeight:700, marginBottom:"0.5rem" }}>Vengtini ingredientai</h2>
            <p style={{ fontSize:"0.82rem", opacity:0.5, marginBottom:"1.8rem" }}>NebÅ«tina</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.55rem", marginBottom:"3rem" }}>
              {AVOID_OPTIONS.map(t => (
                <button key={t} className={"chip"+(form.avoid.includes(t)?" sel":"")} onClick={()=>toggle("avoid",t)}>{t}</button>
              ))}
            </div>
            <div style={{ display:"flex", gap:"1rem" }}>
              <button className="btn ghost" onClick={()=>setStep(3)}>{"\u2190 Atgal"}</button>
              <button className="btn" onClick={()=>setStep(5)}>{"Testi \u2192"}</button>
            </div>
          </div>
        )}

        {/* STEP 5: Pricing */}
        {step === 5 && (
          <div>
            <h2 style={{ fontSize:"1.5rem", fontWeight:700, marginBottom:"1.8rem" }}>Kiekis ir kaina</h2>
            <PricingStep onBack={()=>setStep(4)} onNext={()=>setStep(6)} pricing={pricing} setPricing={setPricing} />
          </div>
        )}

        {/* STEP 6: Packaging */}
        {step === 6 && (
          <div>
            <h2 style={{ fontSize:"1.5rem", fontWeight:700, marginBottom:"0.5rem" }}>PakuotÄ</h2>
            <PackagingStep onBack={()=>setStep(5)} onNext={()=>setStep(7)} productType={form.type} packaging={packaging} setPackaging={setPackaging} selectedSizes={selectedSizes} setSelectedSizes={setSelectedSizes} qty={pricing.qty} />
          </div>
        )}

        {/* STEP 7: Brief */}
        {step === 7 && (
          <div className="fade">
            <h2 style={{ fontSize:"1.5rem", fontWeight:700, marginBottom:"0.5rem" }}>Papildoma informacija</h2>
            <p style={{ fontSize:"0.82rem", opacity:0.5, marginBottom:"1.8rem" }}>NebÅ«tina â tekstÅ«ra, kvapas, pozicionavimas, inspiracija</p>
            <textarea rows={4} placeholder="pvz. NatÅ«rali linija, veganiÅ¡ka, prabangus jausmas, specifinis kvapas..." value={form.brief}
              onChange={e=>setForm(f=>({...f,brief:e.target.value}))} style={{marginBottom:"1.5rem"}} />

            {/* Summary */}
            <div style={{ background:C.white, border:"1.5px solid rgba(0,0,0,0.08)", padding:"1.2rem 1.4rem", marginBottom:"1.5rem", fontSize:"0.85rem", lineHeight:2 }}>
              <div style={{ fontSize:"0.62rem", letterSpacing:"0.12em", textTransform:"uppercase", color:C.red, fontWeight:600, marginBottom:"0.5rem" }}>UÅ¾klausos suvestinÄ</div>
              <div><span style={{ opacity:0.45, fontSize:"0.72rem", marginRight:"0.5rem" }}>Kategorija</span>{catLabel()}</div>
              <div><span style={{ opacity:0.45, fontSize:"0.72rem", marginRight:"0.5rem" }}>Produktas</span>{form.type}</div>
              {form.skin.length>0 && <div><span style={{ opacity:0.45, fontSize:"0.72rem", marginRight:"0.5rem" }}>{ctx().skinLabel}</span>{form.skin.join(", ")}</div>}
              <div><span style={{ opacity:0.45, fontSize:"0.72rem", marginRight:"0.5rem" }}>Efektai</span>{form.effects.join(", ")}</div>
              {form.avoid.length>0 && <div><span style={{ opacity:0.45, fontSize:"0.72rem", marginRight:"0.5rem" }}>Be</span>{form.avoid.join(", ")}</div>}
              <div style={{ marginTop:"0.5rem", paddingTop:"0.6rem", borderTop:"1px solid rgba(0,0,0,0.07)" }}>
                <span style={{ opacity:0.45, fontSize:"0.72rem", marginRight:"0.5rem" }}>Kiekis</span>
                {pricing.qty+" vnt"}
                <span style={{ marginLeft:"1rem", color:C.red, fontWeight:700 }}>{"~"+pricing.total.toLocaleString("lt-LT")+" EUR"}</span>
                <span style={{ opacity:0.4, fontSize:"0.72rem", marginLeft:"0.3rem" }}>({pricing.pricePerUnit.toFixed(2)} EUR/vnt)</span>
              </div>
              {packaging.length > 0 && (
                <div><span style={{ opacity:0.45, fontSize:"0.72rem", marginRight:"0.5rem" }}>PakuotÄs</span>{packaging.map(id => { const p = PACKAGING_CATALOG.find(x=>x.id===id); const sz = selectedSizes[id]||(p&&p.sizes[0])||''; return p ? p.name+' '+sz : ''; }).filter(Boolean).join(", ")}</div>
              )}
            </div>

            {error && <p style={{ color:C.red, fontSize:"0.85rem", marginBottom:"1rem" }}>{error}</p>}
            {loading && [100,100,60].map((w,i)=><div key={i} className="sk" style={{height:"10px",width:w+"%"}} />)}
            <div style={{ display:"flex", gap:"1rem", marginTop:"0.5rem" }}>
              <button className="btn ghost" onClick={()=>setStep(6)} disabled={loading}>{"\u2190 Atgal"}</button>
              <button className="btn" onClick={submit} disabled={loading}>{loading?"Formuluojama...":"Gauti krypti \u2192"}</button>
            </div>
          </div>
        )}

        {/* STEP 8: Result */}
        {step === 8 && result && (
          <div className="fade" ref={resultRef}>
            {/* Red header */}
            <div className="result-header">
              <div style={{ fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", opacity:0.6, marginBottom:"0.5rem" }}>the very lab / receptÅ«ros kryptis</div>
              <div style={{ fontSize:"1.6rem", fontWeight:700, lineHeight:1.2, marginBottom:"0.4rem" }}>{form.type}</div>
              <div style={{ fontSize:"0.8rem", opacity:0.65 }}>{catLabel()+" Â· "+new Date().toLocaleDateString("lt-LT")}</div>
            </div>

            {/* Pricing bar */}
            <div style={{ background:C.black, color:C.white, padding:"1rem 1.8rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem" }}>
              <div>
                <div style={{ fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", opacity:0.5, marginBottom:"0.15rem" }}>Kiekis</div>
                <div style={{ fontSize:"1rem", fontWeight:600 }}>{pricing.qty.toLocaleString("lt-LT")+" vnt"}</div>
              </div>
              <div>
                <div style={{ fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", opacity:0.5, marginBottom:"0.15rem" }}>Kaina / vnt</div>
                <div style={{ fontSize:"1rem", fontWeight:600 }}>{pricing.pricePerUnit.toFixed(2)+" EUR"}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", opacity:0.5, marginBottom:"0.15rem" }}>Bendra suma</div>
                <div style={{ fontSize:"1.3rem", fontWeight:700, color:C.pinkMid }}>{"~"+pricing.total.toLocaleString("lt-LT")+" EUR"}</div>
              </div>
            </div>

            {/* Formula content */}
            <div className="result-body">{renderResult(result)}</div>

            {/* Packaging section */}
            {packaging.length > 0 && (() => {
              const pkgTotal = packaging.reduce((sum, id) => {
                const pkg = PACKAGING_CATALOG.find(p => p.id === id);
                if (!pkg) return sum;
                const sz = selectedSizes[id] || pkg.sizes[0];
                return sum + getPkgPrice(pkg.type, sz) * (pricing.qty || 500);
              }, 0);
              const formulaTotal = pricing.total || 0;
              return (
                <div style={{ border:"1.5px solid rgba(0,0,0,0.08)", background:C.white }}>
                  <div style={{ padding:"1rem 1.4rem", borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize:"0.62rem", letterSpacing:"0.12em", textTransform:"uppercase", color:C.red, fontWeight:600, marginBottom:"0.8rem" }}>Pasirinktos pakuotÄs (Eurovetrocap 2026)</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
                      {packaging.map(id => {
                        const pkg = PACKAGING_CATALOG.find(p => p.id === id);
                        if (!pkg) return null;
                        const sz = selectedSizes[id] || pkg.sizes[0];
                        const uPrice = getPkgPrice(pkg.type, sz);
                        return (
                          <div key={id} style={{ border:"1.5px solid rgba(159,19,45,0.2)", padding:"0.6rem 0.9rem", fontSize:"0.82rem", background:C.cream }}>
                            <div style={{ fontWeight:700 }}>{pkg.name}</div>
                            <div style={{ fontSize:"0.72rem", opacity:0.5 }}>{pkg.material} Â· {sz}</div>
                            <div style={{ fontSize:"0.78rem", color:C.red, fontWeight:600, marginTop:"0.2rem" }}>{"~" + uPrice.toFixed(2) + " EUR/vnt"}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ padding:"1rem 1.4rem", background:"rgba(0,0,0,0.02)", display:"flex", flexWrap:"wrap", gap:"1rem", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ fontSize:"0.78rem", opacity:0.6 }}>
                      <span style={{ marginRight:"1.5rem" }}>FormuluotÄ: <strong>{"~" + formulaTotal.toLocaleString("lt-LT") + " EUR"}</strong></span>
                      <span>PakuotÄ: <strong>{"~" + Math.round(pkgTotal).toLocaleString("lt-LT") + " EUR"}</strong></span>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:"0.62rem", opacity:0.4, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"0.15rem" }}>Viso (be etikeÄiÅ³)</div>
                      <div style={{ fontFamily:"'Afacad',sans-serif", fontSize:"1.4rem", fontWeight:700, color:C.red }}>{"~" + Math.round(formulaTotal + pkgTotal).toLocaleString("lt-LT") + " EUR"}</div>
                    </div>
                  </div>
                  <div style={{ padding:"0.6rem 1.4rem", fontSize:"0.72rem", opacity:0.35, lineHeight:1.5, borderTop:"1px solid rgba(0,0,0,0.05)" }}>Suderinamumas su formuluote bus patvirtintas konsultacijos metu.</div>
                </div>
              );
            })()}

            {/* Disclaimer */}
            <div style={{ background:C.pink, padding:"1rem 1.4rem", fontSize:"0.75rem", opacity:0.8, lineHeight:1.6, borderLeft:"3px solid "+C.red }}>
              Preliminari formulavimo kryptis ir indikatyvi kaina. Galutine receptura ir tiksli kaina pateikiama po laboratorijos konsultacijos.
              {" Susisiekite: "}
              <strong>hello@theverylab.com</strong>
            </div>

            <div style={{ marginTop:"2rem", display:"flex", gap:"1rem", flexWrap:"wrap" }}>
              <button className="btn" onClick={reset}>{"Nauja formule \u2192"}</button>
              <button className="btn ghost" onClick={()=>navigator.clipboard&&navigator.clipboard.writeText(result)}>{"Kopijuoti"}</button>
            </div>

            {/* EARNINGS CALCULATOR */}
            <EarningsCalc costPerUnit={pricing.pricePerUnit} qty={pricing.qty} packaging={packaging} selectedSizes={selectedSizes} />
          </div>
        )}

      </div>
    </div>
  );
}
