import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const SOURCES = [
  // shared / both
  {
    name: "Cults3D.com",
    printerType: "both",
    type: "free",
    cost: "Gratuito + Pago",
    desc: "Grande marketplace com tag 'Commercial use' por modelo. Funciona bem para FDM e resina.",
    tags: ["Personagens", "Acessórios", "FDM", "Resina"],
    url: "https://cults3d.com",
    recommended: false,
  },
  {
    name: "CGTrader.com",
    printerType: "both",
    type: "subscription",
    cost: "Por arquivo",
    desc: "Seção dedicada a impressão 3D com licença comercial explícita. Personagens originais e mascotes para FDM e resina.",
    tags: ["Personagens originais", "Mascotes", "FDM", "Resina"],
    url: "https://www.cgtrader.com",
    recommended: false,
  },
  {
    name: "Patreon (criadores 3D)",
    printerType: "both",
    type: "subscription",
    cost: "~US$ 5–20/mês",
    desc: "Artistas vendem licença comercial nos tiers mais altos. Tem criadores focados em FDM e outros em resina. Procure 'commercial license tier'.",
    tags: ["Articulados FDM", "Miniaturas resina", "Originais"],
    url: "https://www.patreon.com",
    recommended: false,
  },

  // FDM
  {
    name: "Printables.com",
    printerType: "fdm",
    type: "free",
    cost: "Gratuito",
    desc: "Da Prusa. Filtre por 'Commercial use allowed'. Ótimo para articulados, decoração e RPG em FDM.",
    tags: ["Articulados", "Decoração", "RPG"],
    url: "https://www.printables.com",
    recommended: false,
  },
  {
    name: "MyMiniFactory.com",
    printerType: "fdm",
    type: "free",
    cost: "Gratuito + Pago",
    desc: "Boa seleção de modelos maiores para FDM. Licenças documentadas por modelo.",
    tags: ["Miniaturas grandes", "Sci-fi", "Fantasy"],
    url: "https://www.myminifactory.com",
    recommended: false,
  },
  {
    name: "Tribes (MyMiniFactory)",
    printerType: "fdm",
    type: "subscription",
    cost: "~US$ 8–15/mês por criador",
    desc: "Assine criadores independentes. Dezenas de modelos novos/mês com licença comercial no tier pago. Melhor custo-benefício para FDM.",
    tags: ["Alto volume", "Alta qualidade"],
    url: "https://www.myminifactory.com/tribes",
    recommended: true,
  },
  {
    name: "DriveThruRPG / 3D Studio",
    printerType: "fdm",
    type: "subscription",
    cost: "~US$ 5–15/arquivo",
    desc: "Focado em miniaturas para D&D e jogos de tabuleiro. Licença comercial disponível em muitos kits.",
    tags: ["D&D", "Tabuleiro"],
    url: "https://www.drivethrurpg.com",
    recommended: false,
  },

  // Resina
  {
    name: "Loot Studios",
    printerType: "resin",
    type: "subscription",
    cost: "~US$ 14/mês",
    desc: "Assinatura mensal com pacotes completos de miniaturas para resina, licença comercial inclusa. Alta qualidade para RPG e colecionáveis.",
    tags: ["RPG", "Colecionáveis", "Alta qualidade"],
    url: "https://lootstudios.com",
    recommended: true,
  },
  {
    name: "Titan Forge Miniatures",
    printerType: "resin",
    type: "subscription",
    cost: "~US$ 9–15/mês",
    desc: "Miniaturas detalhadas para resina com licença de impressão comercial. Novos pacotes todo mês.",
    tags: ["Miniaturas", "Fantasy", "Sci-fi"],
    url: "https://www.patreon.com/titanforgeminiatures",
    recommended: false,
  },
  {
    name: "EC3D Designs",
    printerType: "resin",
    type: "subscription",
    cost: "~US$ 10/mês",
    desc: "Cenários, terrenos e miniaturas para resina. Ótimo para montar kits completos de RPG para venda.",
    tags: ["Cenários", "Terrenos", "RPG"],
    url: "https://www.patreon.com/ec3d",
    recommended: false,
  },
  {
    name: "Epics 'N' Quests",
    printerType: "resin",
    type: "subscription",
    cost: "~US$ 12/mês",
    desc: "Personagens e miniaturas de alta resolução voltados para resina SLA/MSLA com licença comercial.",
    tags: ["Personagens", "Alta resolução", "SLA/MSLA"],
    url: "https://www.patreon.com/epicsnquests",
    recommended: false,
  },
];

// ─── UTILS ───────────────────────────────────────────────────────────────────

function fmt(v) {
  return "R$ " + Math.max(0, v).toFixed(2).replace(".", ",");
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

function SliderRow({ label, id, min, max, value, step, onChange, suffix = "", hint }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <label htmlFor={id} style={{ fontSize: 13, color: "#888" }}>{label}</label>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#f0e6d0" }}>
          {typeof value === "number" && !Number.isInteger(value) ? value.toFixed(2) : value}{suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step || 1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#c87941" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", marginTop: 2 }}>
        <span>{min}{suffix}</span>
        {hint && <span style={{ color: "#666" }}>{hint}</span>}
        <span>{max}{suffix}</span>
      </div>
    </div>
  );
}

function NumInput({ label, value, onChange, step = 1, prefix = "" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 12, color: "#888" }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", background: "#1a1410", border: "1px solid #2e2520", borderRadius: 6, overflow: "hidden" }}>
        {prefix && <span style={{ padding: "0 8px", color: "#888", fontSize: 13 }}>{prefix}</span>}
        <input
          type="number"
          value={value}
          step={step}
          onChange={e => onChange(Number(e.target.value))}
          style={{ background: "transparent", border: "none", color: "#f0e6d0", fontSize: 15, padding: "8px 10px", width: "100%", outline: "none" }}
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value, accent }) {
  return (
    <div style={{ background: "#1a1410", border: `1px solid ${accent ? "#c87941" : "#2e2520"}`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "#888", marginBottom: 4, letterSpacing: "0.06em" }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: accent ? "#e8a060" : "#f0e6d0" }}>{value}</div>
    </div>
  );
}

function BreakdownBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.max(2, Math.round((value / total) * 100)) : 2;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 12, color: "#888", minWidth: 160 }}>{label}</span>
      <div style={{ flex: 1, background: "#2e2520", borderRadius: 4, height: 5 }}>
        <div style={{ width: pct + "%", background: color || "#c87941", borderRadius: 4, height: 5, transition: "width .3s" }} />
      </div>
      <span style={{ fontSize: 12, color: "#f0e6d0", minWidth: 64, textAlign: "right" }}>{fmt(value)}</span>
    </div>
  );
}

function SourceCard({ source }) {
  const isResin = source.printerType === "resin";
  const accentColor = isResin ? "#6b9fd4" : "#c87941";
  return (
    <div style={{ background: "#1a1410", border: source.recommended ? `1.5px solid ${accentColor}` : "1px solid #2e2520", borderRadius: 10, padding: "1rem 1.1rem", position: "relative" }}>
      {source.recommended && (
        <div style={{ position: "absolute", top: -10, left: 16, background: accentColor, color: "#0d1a24", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 20, letterSpacing: "0.08em" }}>
          RECOMENDADO
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#f0e6d0" }}>{source.name}</div>
        <span style={{ background: source.type === "free" ? "#0f2a1a" : "#1a1208", color: source.type === "free" ? "#4caf7d" : "#e8a060", fontSize: 10, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap", marginLeft: 8 }}>
          {source.cost}
        </span>
      </div>
      <div style={{ fontSize: 12, color: "#999", marginBottom: 10, lineHeight: 1.5 }}>{source.desc}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {source.tags.map(t => (
          <span key={t} style={{ background: "#2e2520", color: "#aaa", fontSize: 10, padding: "2px 8px", borderRadius: 20 }}>{t}</span>
        ))}
      </div>
      <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontSize: 11, color: accentColor, textDecoration: "none", borderBottom: `1px solid ${accentColor}`, paddingBottom: 1 }}>
        Acessar site ↗
      </a>
    </div>
  );
}

// ─── FDM CALCULATOR ──────────────────────────────────────────────────────────

function FdmCalc({ meta, setMeta }) {
  const [gramas, setGramas] = useState(80);
  const [precoRolo, setPrecoRolo] = useState(110);
  const [horas, setHoras] = useState(4);
  const [energia, setEnergia] = useState(0.8);
  const [acabamento, setAcabamento] = useState(8);
  const [embalagem, setEmbalagem] = useState(6);
  const [dep, setDep] = useState(1.2);
  const [taxa, setTaxa] = useState(12);
  const [margem, setMargem] = useState(200);

  const cFilamento = (gramas / 1000) * precoRolo;
  const cEnergia = horas * energia;
  const cDep = horas * dep;
  const cTotal = cFilamento + cEnergia + acabamento + embalagem + cDep;
  const precoBase = cTotal * (1 + margem / 100);
  const taxaVal = precoBase * (taxa / 100);
  const precoFinal = precoBase + taxaVal;
  const lucro = precoFinal - cTotal - taxaVal;
  const margemReal = cTotal > 0 ? Math.round((lucro / cTotal) * 100) : 0;
  const qtd = lucro > 0 ? Math.ceil(meta / lucro) : null;

  const breakdown = [
    ["Filamento", cFilamento],
    ["Energia", cEnergia],
    ["Acabamento/pintura", acabamento],
    ["Embalagem + frete", embalagem],
    ["Depreciação impressora", cDep],
    ["Taxa marketplace", taxaVal],
  ];
  const totalBreakdown = breakdown.reduce((s, [, v]) => s + v, 0);

  return (
    <div>
      <div className="grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.5rem" }}>
        <NumInput label="Filamento usado (g)" value={gramas} onChange={setGramas} />
        <NumInput label="Custo do rolo (R$/kg)" value={precoRolo} onChange={setPrecoRolo} prefix="R$" />
        <NumInput label="Tempo de impressão (h)" value={horas} onChange={setHoras} step={0.5} />
        <NumInput label="Custo energia (R$/h)" value={energia} onChange={setEnergia} step={0.1} prefix="R$" />
        <NumInput label="Acabamento / pintura (R$)" value={acabamento} onChange={setAcabamento} prefix="R$" />
        <NumInput label="Embalagem + frete (R$)" value={embalagem} onChange={setEmbalagem} prefix="R$" />
        <NumInput label="Depreciação impressora (R$/h)" value={dep} onChange={setDep} step={0.1} prefix="R$" />
        <NumInput label="Taxa marketplace (%)" value={taxa} onChange={setTaxa} prefix="%" />
      </div>

      <div style={{ background: "#1a1410", border: "1px solid #2e2520", borderRadius: 10, padding: "1.25rem", marginBottom: "1.5rem" }}>
        <SliderRow label="Margem de lucro desejada" id="margem-fdm" min={50} max={500} value={margem} step={10} onChange={setMargem} suffix="%" hint="Recomendado: 150–250%" />
      </div>

      <div className="grid4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: "1.5rem" }}>
        <MetricCard label="Custo total" value={fmt(cTotal)} />
        <MetricCard label="Preço sugerido" value={fmt(precoFinal)} accent />
        <MetricCard label="Lucro líquido" value={fmt(lucro)} />
        <MetricCard label="Margem real" value={margemReal + "%"} />
      </div>

      <div style={{ background: "#1a1410", border: "1px solid #2e2520", borderRadius: 10, padding: "1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, color: "#888", letterSpacing: "0.08em", marginBottom: 14 }}>DIVISÃO DOS CUSTOS</div>
        {breakdown.map(([label, value]) => (
          <BreakdownBar key={label} label={label} value={value} total={totalBreakdown} color="#c87941" />
        ))}
      </div>

      <div style={{ background: "#1a1410", border: "1px solid #2e2520", borderRadius: 10, padding: "1.25rem" }}>
        <div style={{ fontSize: 11, color: "#888", letterSpacing: "0.08em", marginBottom: 12 }}>META MENSAL</div>
        <NumInput label="Renda desejada por mês (R$)" value={meta} onChange={setMeta} prefix="R$" />
        {qtd !== null
          ? <div style={{ marginTop: 14, fontSize: 15 }}>Você precisa vender <span style={{ fontSize: 22, fontWeight: 700, color: "#e8a060" }}>{qtd}</span> peças/mês.</div>
          : <div style={{ marginTop: 14, fontSize: 13, color: "#888" }}>Ajuste a margem para calcular.</div>
        }
      </div>
    </div>
  );
}

// ─── RESIN CALCULATOR ────────────────────────────────────────────────────────

function ResinCalc({ meta, setMeta }) {
  const [ml, setMl] = useState(50);
  const [precoResina, setPrecoResina] = useState(180);  // R$/litro
  const [horas, setHoras] = useState(3);
  const [energia, setEnergia] = useState(0.5);          // UV+FEP+curador
  const [lavagem, setLavagem] = useState(4);            // IPA/álcool
  const [fep, setFep] = useState(3);                    // depreciação FEP
  const [acabamento, setAcabamento] = useState(12);
  const [embalagem, setEmbalagem] = useState(6);
  const [dep, setDep] = useState(1.5);                  // depreciação impressora
  const [taxa, setTaxa] = useState(12);
  const [margem, setMargem] = useState(250);

  const cResina = (ml / 1000) * precoResina;
  const cEnergia = horas * energia;
  const cDep = horas * dep;
  const cTotal = cResina + cEnergia + lavagem + fep + acabamento + embalagem + cDep;
  const precoBase = cTotal * (1 + margem / 100);
  const taxaVal = precoBase * (taxa / 100);
  const precoFinal = precoBase + taxaVal;
  const lucro = precoFinal - cTotal - taxaVal;
  const margemReal = cTotal > 0 ? Math.round((lucro / cTotal) * 100) : 0;
  const qtd = lucro > 0 ? Math.ceil(meta / lucro) : null;

  const breakdown = [
    ["Resina", cResina],
    ["Energia (UV + curador)", cEnergia],
    ["Lavagem (IPA/álcool)", lavagem],
    ["Depreciação FEP", fep],
    ["Acabamento/pintura", acabamento],
    ["Embalagem + frete", embalagem],
    ["Depreciação impressora", cDep],
    ["Taxa marketplace", taxaVal],
  ];
  const totalBreakdown = breakdown.reduce((s, [, v]) => s + v, 0);

  return (
    <div>
      <div style={{ background: "#0d1a24", border: "1px solid #1a3a52", borderRadius: 8, padding: "10px 14px", marginBottom: "1.25rem", fontSize: 12, color: "#6b9fd4", lineHeight: 1.6 }}>
        Resina tem custo de material maior que FDM, mas permite detalhamento muito superior — miniaturas de RPG, colecionáveis e figuras com partes finas vendem por preços maiores. Use margem de 200–350%.
      </div>

      <div className="grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.5rem" }}>
        <NumInput label="Resina usada (ml)" value={ml} onChange={setMl} />
        <NumInput label="Custo da resina (R$/litro)" value={precoResina} onChange={setPrecoResina} prefix="R$" />
        <NumInput label="Tempo de impressão (h)" value={horas} onChange={setHoras} step={0.5} />
        <NumInput label="Energia UV + curador (R$/h)" value={energia} onChange={setEnergia} step={0.1} prefix="R$" />
        <NumInput label="Lavagem IPA/álcool (R$)" value={lavagem} onChange={setLavagem} step={0.5} prefix="R$" />
        <NumInput label="Depreciação FEP (R$/peça)" value={fep} onChange={setFep} step={0.5} prefix="R$" />
        <NumInput label="Acabamento / pintura (R$)" value={acabamento} onChange={setAcabamento} prefix="R$" />
        <NumInput label="Embalagem + frete (R$)" value={embalagem} onChange={setEmbalagem} prefix="R$" />
        <NumInput label="Depreciação impressora (R$/h)" value={dep} onChange={setDep} step={0.1} prefix="R$" />
        <NumInput label="Taxa marketplace (%)" value={taxa} onChange={setTaxa} prefix="%" />
      </div>

      <div style={{ background: "#1a1410", border: "1px solid #2e2520", borderRadius: 10, padding: "1.25rem", marginBottom: "1.5rem" }}>
        <SliderRow label="Margem de lucro desejada" id="margem-resina" min={50} max={500} value={margem} step={10} onChange={setMargem} suffix="%" hint="Recomendado: 200–350%" />
      </div>

      <div className="grid4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: "1.5rem" }}>
        <MetricCard label="Custo total" value={fmt(cTotal)} />
        <MetricCard label="Preço sugerido" value={fmt(precoFinal)} accent />
        <MetricCard label="Lucro líquido" value={fmt(lucro)} />
        <MetricCard label="Margem real" value={margemReal + "%"} />
      </div>

      <div style={{ background: "#1a1410", border: "1px solid #2e2520", borderRadius: 10, padding: "1.25rem", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, color: "#888", letterSpacing: "0.08em", marginBottom: 14 }}>DIVISÃO DOS CUSTOS</div>
        {breakdown.map(([label, value]) => (
          <BreakdownBar key={label} label={label} value={value} total={totalBreakdown} color="#6b9fd4" />
        ))}
      </div>

      <div style={{ background: "#1a1410", border: "1px solid #2e2520", borderRadius: 10, padding: "1.25rem" }}>
        <div style={{ fontSize: 11, color: "#888", letterSpacing: "0.08em", marginBottom: 12 }}>META MENSAL</div>
        <NumInput label="Renda desejada por mês (R$)" value={meta} onChange={setMeta} prefix="R$" />
        {qtd !== null
          ? <div style={{ marginTop: 14, fontSize: 15 }}>Você precisa vender <span style={{ fontSize: 22, fontWeight: 700, color: "#6b9fd4" }}>{qtd}</span> peças/mês.</div>
          : <div style={{ marginTop: 14, fontSize: 13, color: "#888" }}>Ajuste a margem para calcular.</div>
        }
      </div>
    </div>
  );
}

// ─── SOURCES TAB ─────────────────────────────────────────────────────────────

function SourcesTab() {
  const [printerFilter, setPrinterFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = SOURCES.filter(s => {
    const matchPrinter = printerFilter === "all" || s.printerType === printerFilter || s.printerType === "both";
    const matchType = typeFilter === "all" || s.type === typeFilter;
    return matchPrinter && matchType;
  });

  const pillStyle = (active, color = "#c87941") => ({
    padding: "6px 16px", borderRadius: 20, border: "1px solid",
    borderColor: active ? color : "#2e2520",
    background: active ? color : "transparent",
    color: active ? (color === "#c87941" ? "#1a0e08" : "#0d1a24") : "#888",
    fontSize: 12, fontWeight: 600, cursor: "pointer",
  });

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 11, color: "#666", marginBottom: 8, letterSpacing: "0.08em" }}>TIPO DE IMPRESSORA</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1rem" }}>
          {[["all", "Todas"], ["fdm", "FDM"], ["resin", "Resina"], ["both", "Ambas"]].map(([val, label]) => (
            <button key={val} onClick={() => setPrinterFilter(val)} style={pillStyle(printerFilter === val, val === "resin" ? "#6b9fd4" : "#c87941")}>{label}</button>
          ))}
        </div>

        <div style={{ fontSize: 11, color: "#666", marginBottom: 8, letterSpacing: "0.08em" }}>CUSTO</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[["all", "Todos"], ["free", "Gratuito"], ["subscription", "Assinatura/Pago"]].map(([val, label]) => (
            <button key={val} onClick={() => setTypeFilter(val)} style={pillStyle(typeFilter === val)}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: "1.5rem" }}>
        {filtered.length === 0
          ? <div style={{ color: "#666", fontSize: 13, padding: "2rem 0", textAlign: "center" }}>Nenhuma fonte encontrada com esses filtros.</div>
          : filtered.map(s => <SourceCard key={s.name + s.printerType} source={s} />)
        }
      </div>

      <div style={{ border: "1px solid #4a3010", background: "#1c1208", borderRadius: 10, padding: "1rem 1.25rem" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#e8a060", marginBottom: 6 }}>⚠ Sempre confirme antes de vender</div>
        <div style={{ fontSize: 12, color: "#999", lineHeight: 1.6 }}>
          Mesmo em plataformas seguras, verifique a licença de cada arquivo individualmente.
          Procure os termos <em>"commercial use"</em>, <em>"for sale"</em> ou <em>"selling prints allowed"</em>.
          Em dúvida, contate o criador diretamente.
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("fdm");
  const [meta, setMeta] = useState(2000);

  const tabs = [
    { id: "fdm",    label: "FDM" },
    { id: "resin",  label: "Resina" },
    { id: "sources",label: "Fontes de Modelos" },
  ];

  const tabStyle = (id) => {
    const isResin = id === "resin";
    const active = tab === id;
    const activeColor = isResin ? "#6b9fd4" : "#c87941";
    return {
      padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
      fontSize: 13, fontWeight: 600,
      background: active ? activeColor : "transparent",
      color: active ? (isResin ? "#0d1a24" : "#1a0e08") : "#888",
      transition: "all .2s",
    };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#110d0a", color: "#f0e6d0", fontFamily: "'DM Mono', 'Fira Mono', monospace", padding: "0 0 4rem" }}>
      <style>{`
        * { box-sizing: border-box; }
        input[type=number]::-webkit-inner-spin-button { opacity: .4; }
        input[type=range] { cursor: pointer; }
        a:hover { opacity: .75; }
        @media (max-width: 600px) {
          .grid2 { grid-template-columns: 1fr !important; }
          .grid4 { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div style={{ borderBottom: "1px solid #2e2520", padding: "1.5rem 1.5rem 1rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: "#c87941", letterSpacing: "0.15em", marginBottom: 4 }}>IMPRESSÃO 3D</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Kit do Maker Vendedor</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>Calcule preços para FDM e resina · Encontre modelos com licença comercial</p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "1rem 1.5rem 0" }}>
        <div style={{ display: "flex", gap: 4, background: "#1a1410", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {tabs.map(t => (
            <button key={t.id} style={tabStyle(t.id)} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "1.5rem" }}>
        {tab === "fdm"     && <FdmCalc   meta={meta} setMeta={setMeta} />}
        {tab === "resin"   && <ResinCalc meta={meta} setMeta={setMeta} />}
        {tab === "sources" && <SourcesTab />}
      </div>
    </div>
  );
}
