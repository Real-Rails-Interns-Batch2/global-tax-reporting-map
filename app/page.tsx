"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { flows } from "./data/flows";
import { countries as staticCountries } from "./data/countries";

const WorldMap = dynamic(() => import("./components/WorldMap"), { ssr: false });

const API = "http://127.0.0.1:8000";

const statusColors: Record<string, string> = {
  Active:  "#4ADE80",
  Partial: "#FBBF24",
  Pending: "#EF4444",
};

const riskColors: Record<string, string> = {
  Low:    "#4ADE80",
  Medium: "#FBBF24",
  High:   "#EF4444",
};

const volumeColors: Record<string, string> = {
  High:   "#38BDF8",
  Medium: "#A78BFA",
  Low:    "#FBBF24",
};

type Tab = "map" | "timeline" | "compare" | "flows" | "analytics" | "participation";

export default function Home() {
  const [countryData, setCountryData]   = useState(staticCountries);
  const [selected, setSelected]         = useState<string | null>(null);
  const [search, setSearch]             = useState("");
  const [regionFilter, setRegionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [riskFilter, setRiskFilter]     = useState("All");
  const [activeTab, setActiveTab]       = useState<Tab>("map");
  const [question, setQuestion]         = useState("");
  const [aiResults, setAiResults]       = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading]       = useState(false);
  const [compareA, setCompareA]         = useState(staticCountries[0]?.name ?? "");
  const [compareB, setCompareB]         = useState(staticCountries[1]?.name ?? "");
  const [metrics, setMetrics]           = useState({
    totalCountries: staticCountries.length,
    activeParticipants: staticCountries.filter(c => c.status === "Active").length,
    averageTransparency: Math.round(staticCountries.reduce((a, c) => a + c.transparencyScore, 0) / staticCountries.length),
    highRiskJurisdictions: staticCountries.filter(c => c.reportingRisk === "High").length,
  });

  // Fetch from backend
  useEffect(() => {
    axios.get(`${API}/countries`)
      .then((res) => { setCountryData(res.data); })
      .catch(() => {});

    axios.get(`${API}/metrics`)
      .then((res) => { setMetrics(res.data); })
      .catch(() => {});
  }, []);

  const askAI = async () => {
    if (!question.trim()) return;
    setAiLoading(true);
    try {
      const res = await axios.post(`${API}/ask`, { question });
      setAiResults(res.data.agent_responses || {});
    } catch {
      setAiResults({ "Error": "Backend not connected. Please start the backend server." });
    } finally {
      setAiLoading(false);
    }
  };

  // Filters
  const regions   = ["All", ...Array.from(new Set(staticCountries.map(c => c.region ?? "Other")))];
  const statuses  = ["All", "Active", "Partial", "Pending"];
  const risks     = ["All", "Low", "Medium", "High"];

  const filtered = countryData.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (regionFilter !== "All" && (c as any).region !== regionFilter) return false;
    if (statusFilter !== "All" && c.status !== statusFilter) return false;
    if (riskFilter   !== "All" && c.reportingRisk !== riskFilter) return false;
    return true;
  });

  const selectedCountry = countryData.find(c => c.name === selected);
  const countryA        = countryData.find(c => c.name === compareA);
  const countryB        = countryData.find(c => c.name === compareB);
  const highFlows       = flows.filter(f => f.volume === "High").length;

  function downloadCSV() {
    const rows = [
      "Name,Status,AdoptionYear,TransparencyScore,ReportingRisk",
      ...countryData.map(c =>
        `"${c.name}",${c.status},${c.adoptionYear},${c.transparencyScore},${c.reportingRisk}`
      ),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "global_tax_reporting.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "map",           label: "🗺️ Map" },
    { id: "participation", label: "🌐 Participation" },
    { id: "timeline",      label: "📅 Timeline" },
    { id: "flows",         label: "🔄 Flows" },
    { id: "compare",       label: "⚖️ Compare" },
    { id: "analytics",     label: "📊 Analytics" },
  ];

  return (
    <main style={{ background: "#030712" }} className="text-white h-screen flex flex-col overflow-hidden">

      {/* HEADER */}
      <header className="flex-shrink-0 px-6 py-3 flex items-center justify-between gap-4"
        style={{ background: "#0B1117", borderBottom: "1px solid #1F2937" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#0d1f35", border: "1px solid #38BDF830" }}>🏛️</div>
          <div>
            <h1 className="text-sm font-bold text-white">Global Tax Reporting Map</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs px-1.5 rounded font-medium"
                style={{ background: "#38BDF814", color: "#38BDF8", border: "1px solid #38BDF830" }}>LIVE</span>
              <span className="text-xs text-gray-600">Real Rails · Governance & Trust Rail</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl px-3 py-1.5 text-xs text-white outline-none"
            style={{ background: "#030712", border: "1px solid #1F2937", width: "180px" }}
          />
          
        </div>
      </header>

      {/* METRICS BAR */}
      <div className="flex-shrink-0 grid grid-cols-4 gap-3 px-4 py-3"
        style={{ background: "#0B1117", borderBottom: "1px solid #1F2937" }}>
        {[
          { label: "Total Countries",       value: metrics.totalCountries,        color: "#38BDF8" },
          { label: "Active Participants",   value: metrics.activeParticipants,    color: "#4ADE80" },
          { label: "Avg Transparency",      value: `${metrics.averageTransparency}%`, color: "#A78BFA" },
          { label: "High Risk",             value: metrics.highRiskJurisdictions, color: "#EF4444" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl px-4 py-2 flex items-center justify-between"
            style={{ background: "#030712", border: "1px solid #1F2937" }}>
            <span className="text-xs text-gray-500">{m.label}</span>
            <span className="text-lg font-bold" style={{ color: m.color }}>{m.value}</span>
          </div>
        ))}
      </div>

      {/* TAB + FILTER BAR */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 overflow-x-auto"
        style={{ background: "#0B1117", borderBottom: "1px solid #1F2937" }}>
        <div className="flex gap-1 flex-shrink-0">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
              style={{
                background: activeTab === tab.id ? "#38BDF8" : "transparent",
                color:      activeTab === tab.id ? "#000"    : "#6B7280",
                border:     activeTab === tab.id ? "1px solid #38BDF8" : "1px solid transparent",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-px h-5 flex-shrink-0" style={{ background: "#1F2937" }} />

        {[
          { value: regionFilter, onChange: setRegionFilter, options: regions,  label: "Region" },
          { value: statusFilter, onChange: setStatusFilter, options: statuses, label: "Status" },
          { value: riskFilter,   onChange: setRiskFilter,   options: risks,    label: "Risk" },
        ].map((f) => (
          <div key={f.label} className="relative flex-shrink-0">
            <select value={f.value} onChange={(e) => f.onChange(e.target.value)}
              className="appearance-none rounded-lg pl-2 pr-6 py-1.5 text-xs text-white outline-none cursor-pointer"
              style={{ background: "#030712", border: "1px solid #1F2937", minWidth: "100px" }}>
              {f.options.map((o) => (
                <option key={o} value={o}>{o === "All" ? `All ${f.label}` : o}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-500" style={{ fontSize: "9px" }}>▾</span>
          </div>
        ))}

        <span className="text-xs text-gray-600 whitespace-nowrap flex-shrink-0">
          {filtered.length}/{countryData.length}
        </span>
      </div>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT 70% */}
        <section className="flex flex-col p-4 overflow-hidden" style={{ width: "70%", borderRight: "1px solid #1F2937" }}>

          {/* Legend */}
          <div className="flex gap-4 mb-3 text-xs flex-shrink-0 flex-wrap">
            {[
              { label: "Active",      color: "#4ADE80" },
              { label: "Partial",     color: "#FBBF24" },
              { label: "High Flow",   color: "#38BDF8" },
              { label: "Medium Flow", color: "#A78BFA" },
              { label: "Low Flow",    color: "#FBBF2488" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 whitespace-nowrap">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <span style={{ color: item.color }}>{item.label}</span>
              </div>
            ))}
            <span className="text-gray-600 ml-auto">{filtered.length} of {countryData.length}</span>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden rounded-2xl" style={{ border: "1px solid #1F2937", background: "#0B1117" }}>

            {/* MAP */}
            {activeTab === "map" && (
              <WorldMap onSelectCountry={setSelected} />
            )}

            {/* PARTICIPATION */}
            {activeTab === "participation" && (
              <div className="p-6 overflow-y-auto h-full">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">🌐 Participation Status</h3>
                <div className="grid grid-cols-2 gap-3">
                  {filtered.map((c) => (
                    <div key={c.name} className="flex items-center justify-between p-3 rounded-xl cursor-pointer"
                      style={{ background: "#030712", border: `1px solid ${statusColors[c.status]}33` }}
                      onClick={() => setSelected(c.name)}>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColors[c.status] }} />
                        <span className="text-sm text-white">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: riskColors[c.reportingRisk] }}>{c.reportingRisk} Risk</span>
                        <span className="text-xs px-2 py-0.5 rounded-lg"
                          style={{ border: `1px solid ${statusColors[c.status]}`, color: statusColors[c.status] }}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TIMELINE */}
            {activeTab === "timeline" && (
              <div className="p-6 overflow-y-auto h-full">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">📅 Timeline of Adoption</h3>
                <div className="space-y-6">
                  {[2014, 2016, 2017, 2018, 2019].map((year) => {
                    const yearCountries = countryData.filter(c => c.adoptionYear === year);
                    if (yearCountries.length === 0) return null;
                    return (
                      <div key={year} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: "#38BDF822", color: "#38BDF8", border: "1px solid #38BDF8" }}>
                            {year}
                          </div>
                          <div className="flex-1 w-px mt-2" style={{ background: "#1F2937" }} />
                        </div>
                        <div className="flex flex-wrap gap-2 pb-4">
                          {yearCountries.map((c) => (
                            <div key={c.name} className="px-3 py-1.5 rounded-lg text-xs cursor-pointer"
                              style={{ background: "#030712", border: `1px solid ${statusColors[c.status]}44`, color: statusColors[c.status] }}
                              onClick={() => setSelected(c.name)}>
                              {c.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FLOWS */}
            {activeTab === "flows" && (
              <div className="p-6 overflow-y-auto h-full">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">🔄 Reporting Flows</h3>
                <div className="space-y-2">
                  {flows.map((flow, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: "#030712", border: "1px solid #1F2937" }}>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-white">{flow.from}</span>
                        <span className="text-gray-500">→</span>
                        <span className="text-sm font-medium text-white">{flow.to}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-lg font-semibold"
                        style={{ border: `1px solid ${volumeColors[flow.volume]}`, color: volumeColors[flow.volume] }}>
                        {flow.volume}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COMPARE */}
            {activeTab === "compare" && (
              <div className="p-6 overflow-y-auto h-full">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">⚖️ Compare Countries</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { value: compareA, onChange: setCompareA },
                    { value: compareB, onChange: setCompareB },
                  ].map((s, i) => (
                    <select key={i} value={s.value} onChange={(e) => s.onChange(e.target.value)}
                      className="rounded-xl px-3 py-2 text-sm text-white outline-none"
                      style={{ background: "#030712", border: "1px solid #38BDF8" }}>
                      {countryData.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  ))}
                </div>
                {countryA && countryB && (
                  <div className="space-y-3">
                    {[
                      { label: "Status",            a: countryA.status,            b: countryB.status },
                      { label: "Adoption Year",     a: countryA.adoptionYear,      b: countryB.adoptionYear },
                      { label: "Transparency Score",a: `${countryA.transparencyScore}/100`, b: `${countryB.transparencyScore}/100` },
                      { label: "Reporting Risk",    a: countryA.reportingRisk,     b: countryB.reportingRisk },
                    ].map((row) => (
                      <div key={row.label} className="grid grid-cols-3 gap-3 items-center">
                        <div className="text-xs text-gray-500 text-center">{String(row.a)}</div>
                        <div className="text-xs text-gray-400 text-center uppercase tracking-wide">{row.label}</div>
                        <div className="text-xs text-gray-500 text-center">{String(row.b)}</div>
                      </div>
                    ))}
                    {/* Bar comparison */}
                    <div className="mt-4 space-y-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Transparency Score</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-cyan-400 w-24 truncate">{countryA.name}</span>
                        <div className="flex-1 rounded-full" style={{ background: "#1F2937", height: 6 }}>
                          <div style={{ width: `${countryA.transparencyScore}%`, background: "#38BDF8", height: 6, borderRadius: 9999 }} />
                        </div>
                        <span className="text-xs text-cyan-400">{countryA.transparencyScore}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-purple-400 w-24 truncate">{countryB.name}</span>
                        <div className="flex-1 rounded-full" style={{ background: "#1F2937", height: 6 }}>
                          <div style={{ width: `${countryB.transparencyScore}%`, background: "#A78BFA", height: 6, borderRadius: 9999 }} />
                        </div>
                        <span className="text-xs text-purple-400">{countryB.transparencyScore}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ANALYTICS */}
            {activeTab === "analytics" && (
              <div className="p-6 overflow-y-auto h-full space-y-6">
                <h3 className="text-xs uppercase tracking-widest text-gray-500">📊 Analytics</h3>

                {/* Risk breakdown */}
                <div className="rounded-2xl p-5" style={{ border: "1px solid #1F2937", background: "#030712" }}>
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Risk Distribution</h4>
                  {["Low", "Medium", "High"].map((risk) => {
                    const count = countryData.filter(c => c.reportingRisk === risk).length;
                    const pct   = Math.round((count / countryData.length) * 100);
                    return (
                      <div key={risk} className="flex items-center gap-3 mb-3">
                        <span className="text-xs w-16" style={{ color: riskColors[risk] }}>{risk}</span>
                        <div className="flex-1 rounded-full" style={{ background: "#1F2937", height: 6 }}>
                          <div style={{ width: `${pct}%`, background: riskColors[risk], height: 6, borderRadius: 9999 }} />
                        </div>
                        <span className="text-xs text-gray-400">{count} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>

                {/* Transparency scores */}
                <div className="rounded-2xl p-5" style={{ border: "1px solid #1F2937", background: "#030712" }}>
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Transparency Scores</h4>
                  {[...countryData].sort((a, b) => b.transparencyScore - a.transparencyScore).slice(0, 10).map((c) => (
                    <div key={c.name} className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-gray-400 w-32 truncate">{c.name}</span>
                      <div className="flex-1 rounded-full" style={{ background: "#1F2937", height: 4 }}>
                        <div style={{ width: `${c.transparencyScore}%`, background: "#38BDF8", height: 4, borderRadius: 9999 }} />
                      </div>
                      <span className="text-xs text-cyan-400">{c.transparencyScore}</span>
                    </div>
                  ))}
                </div>

                {/* Adoption by year */}
                <div className="rounded-2xl p-5" style={{ border: "1px solid #1F2937", background: "#030712" }}>
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Adoption by Year</h4>
                  {[2014, 2016, 2017, 2018, 2019].map((year) => {
                    const count = countryData.filter(c => c.adoptionYear === year).length;
                    return (
                      <div key={year} className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-gray-400 w-12">{year}</span>
                        <div className="flex-1 rounded-full" style={{ background: "#1F2937", height: 6 }}>
                          <div style={{ width: `${(count / 10) * 100}%`, background: "#A78BFA", height: 6, borderRadius: 9999 }} />
                        </div>
                        <span className="text-xs text-purple-400">{count} countries</span>
                      </div>
                    );
                  })}
                </div>

                {/* AI Tax Intelligence */}
                <div className="rounded-2xl p-5" style={{ border: "1px solid #1F2937", background: "#030712" }}>
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">🤖 AI Tax Intelligence</h4>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="Ask about CRS, OECD, FATCA..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && askAI()}
                      className="flex-1 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      style={{ background: "#0B1117", border: "1px solid #1F2937" }}
                    />
                    <button onClick={askAI}
                      className="rounded-xl px-4 py-2 text-xs font-medium transition"
                      style={{ background: aiLoading ? "#1F2937" : "#38BDF8", color: aiLoading ? "#6B7280" : "#000" }}>
                      {aiLoading ? "..." : "Ask"}
                    </button>
                  </div>
                  {Object.entries(aiResults).map(([agent, result]) => (
                    <div key={agent} className="rounded-xl p-3" style={{ background: "#0B1117", border: "1px solid #1F2937" }}>
                      <p className="text-xs text-cyan-400 font-semibold mb-2">{agent}</p>
                      <p className="text-xs text-gray-300 leading-5 whitespace-pre-wrap">{String(result)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT SIDEBAR 30% */}
        <aside className="overflow-y-auto flex-shrink-0 p-4 space-y-4" style={{ width: "30%", background: "#030712" }}>

          {/* Selected Country */}
          {selectedCountry ? (
            <div className="rounded-2xl p-5" style={{ border: "1px solid #1F2937", background: "#0B1117" }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-cyan-400">{selectedCountry.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-lg"
                  style={{ border: `1px solid ${statusColors[selectedCountry.status]}`, color: statusColors[selectedCountry.status] }}>
                  {selectedCountry.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Adoption Year",  value: selectedCountry.adoptionYear,      color: "#FBBF24" },
                  { label: "Transparency",   value: `${selectedCountry.transparencyScore}/100`, color: "#38BDF8" },
                  { label: "Reporting Risk", value: selectedCountry.reportingRisk,     color: riskColors[selectedCountry.reportingRisk] },
                  { label: "CRS Status",     value: selectedCountry.status,            color: statusColors[selectedCountry.status] },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl p-3" style={{ border: "1px solid #1F2937", background: "#030712" }}>
                    <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                    <p className="mt-1 text-sm font-bold" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-5" style={{ border: "1px solid #1F2937", background: "#0B1117" }}>
              <p className="text-xs text-gray-500 text-center">Click a country on the map to see details</p>
            </div>
          )}

          {/* Why This Matters */}
          <div className="rounded-2xl p-5" style={{ border: "1px solid #1F2937", background: "#0B1117" }}>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Why This Matters</h3>
            <p className="text-xs text-gray-300 leading-5">
              Automatic exchange of financial information between tax authorities
              closes loopholes used to hide wealth offshore. Every reporting
              connection added to the network reduces the shadow financial system
              and increases fiscal transparency for governments worldwide.
            </p>
          </div>

          {/* Who Controls The Rail */}
          <div className="rounded-2xl p-5" style={{ border: "1px solid #1F2937", background: "#0B1117" }}>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Who Controls The Rail</h3>
            <p className="text-xs text-gray-300 leading-5 mb-3">
              The OECD sets the global standards for automatic exchange of financial
              account information. National tax authorities implement and enforce
              these standards locally.
            </p>
            <div className="space-y-2">
              {[
                { entity: "OECD",      role: "Global Standards Body" },
                { entity: "CRS",       role: "Common Reporting Standard" },
                { entity: "FATCA",     role: "US Tax Compliance Act" },
                { entity: "HMRC (UK)", role: "Revenue & Customs" },
                { entity: "EU DAC",    role: "EU Directive on Admin Cooperation" },
              ].map((item) => (
                <div key={item.entity} className="flex items-center justify-between text-xs p-2 rounded-lg"
                  style={{ background: "#030712" }}>
                  <span className="text-cyan-400 font-medium">{item.entity}</span>
                  <span className="text-gray-500">{item.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Source Status */}
          <div className="rounded-2xl p-5" style={{ border: "1px solid #1F2937", background: "#0B1117" }}>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Data Source Status</h3>
            <div className="space-y-2">
              {[
                { label: "OECD CRS Network", status: "Synthetic", color: "#FBBF24" },
                { label: "World Bank Data",  status: "Synthetic", color: "#FBBF24" },
                { label: "Country Flows",    status: "Synthetic", color: "#FBBF24" },
                { label: "Map Tiles",        status: "Live",      color: "#4ADE80" },
                { label: "FastAPI Backend",  status: "Live",      color: "#4ADE80" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{s.label}</span>
                  <span className="px-2 py-0.5 rounded-lg"
                    style={{ border: `1px solid ${s.color}`, color: s.color }}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Select */}
          <div className="rounded-2xl p-5" style={{ border: "1px solid #1F2937", background: "#0B1117" }}>
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Quick Select</h3>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {filtered.map((c) => (
                <div key={c.name} onClick={() => setSelected(c.name)}
                  className="flex items-center justify-between cursor-pointer rounded-xl px-3 py-2 transition"
                  style={{
                    background: selected === c.name ? "#1F2937" : "transparent",
                    border: selected === c.name ? "1px solid #38BDF8" : "1px solid transparent",
                  }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: statusColors[c.status], flexShrink: 0 }} />
                    <span className="text-xs text-white">{c.name}</span>
                  </div>
                  <span className="text-xs" style={{ color: riskColors[c.reportingRisk] }}>{c.reportingRisk}</span>
                </div>
              ))}
            </div>
          </div>
        {/* Download Sample Data — Bottom */}
<div className="rounded-2xl p-5"
  style={{ border: "1px solid #1F2937", background: "#0B1117" }}>
  <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
    Export Data
  </h3>
  <p className="text-xs text-gray-400 mb-3">
    Download all country tax reporting data as a CSV file.
  </p>
  <button
    onClick={downloadCSV}
    className="w-full rounded-xl py-2 text-xs font-medium transition"
    style={{ border: "1px solid #38BDF8", color: "#38BDF8" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#38BDF8";
      e.currentTarget.style.color = "#000";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = "#38BDF8";
    }}>
    ⬇ Download Sample Data
  </button>
</div>
        </aside>
      </div>
    </main>
  );
}
