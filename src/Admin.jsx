import React, { useState, useEffect } from "react";

const PIPEDRIVE_TOKEN = "331af678135f52599f72a25beb952fc8f1e31a00";
const C = { red: "#9F132D", cream: "#FBF8EE", pink: "#F6D4D8", black: "#000" };

export default function Admin() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const r = await fetch(
        `https://api.pipedrive.com/v1/persons?api_token=${PIPEDRIVE_TOKEN}&limit=100&sort=add_time DESC`
      );
      const d = await r.json();
      const persons = d.data || [];

      // Get deals for each person
      const withDeals = await Promise.all(
        persons.map(async (p) => {
          const dr = await fetch(
            `https://api.pipedrive.com/v1/persons/${p.id}/deals?api_token=${PIPEDRIVE_TOKEN}`
          );
          const dd = await dr.json();
          return { ...p, deals: dd.data || [] };
        })
      );
      setLeads(withDeals);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const filtered = leads.filter((l) => {
    const name = l.name?.toLowerCase() || "";
    const phone = l.phone?.[0]?.value || "";
    const email = l.email?.[0]?.value || "";
    const matchSearch =
      !search ||
      name.includes(search.toLowerCase()) ||
      phone.includes(search) ||
      email.includes(search.toLowerCase());
    if (filter === "deals") return matchSearch && l.deals.length > 0;
    if (filter === "no-deals") return matchSearch && l.deals.length === 0;
    return matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "Afacad, sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.red, padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: "#fff", fontWeight: 700, letterSpacing: "0.1em", fontSize: "1rem", textTransform: "uppercase" }}>
          The Very Lab — Admin
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <a href="/" style={{ color: "#fff", fontSize: "0.8rem", opacity: 0.8, textDecoration: "none" }}>← App</a>
          <button onClick={fetchLeads} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "0.4rem 1rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}>
            Refresh
          </button>
        </div>
      </div>

      <div style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Total Leads", value: leads.length },
            { label: "With Deals", value: leads.filter(l => l.deals.length > 0).length },
            { label: "New (no deal)", value: leads.filter(l => l.deals.length === 0).length },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", borderRadius: "8px", padding: "1.25rem 1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: C.red }}>{s.value}</div>
              <div style={{ fontSize: "0.8rem", opacity: 0.5, marginTop: "0.25rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          <input
            type="text" placeholder="Search name, phone, email..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: "200px", padding: "0.6rem 1rem", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.9rem", background: "#fff" }}
          />
          {["all", "deals", "no-deals"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "0.6rem 1.25rem", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: filter === f ? 700 : 400, background: filter === f ? C.red : "#fff", color: filter === f ? "#fff" : C.black, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              {f === "all" ? "All" : f === "deals" ? "Has Deal" : "New"}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", opacity: 0.4 }}>Loading leads...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", opacity: 0.4 }}>No leads found</div>
        ) : (
          <div style={{ background: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: C.cream, borderBottom: "2px solid " + C.pink }}>
                  {["Name", "Phone", "Email", "Company", "Deals", "Added"].map(h => (
                    <th key={h} style={{ padding: "0.85rem 1rem", textAlign: "left", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.5, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l, i) => (
                  <tr key={l.id} style={{ borderBottom: "1px solid " + C.pink, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 600, fontSize: "0.9rem" }}>{l.name || "—"}</td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.85rem", opacity: 0.7 }}>{l.phone?.[0]?.value || "—"}</td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.85rem", opacity: 0.7 }}>{l.email?.[0]?.value || "—"}</td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.85rem", opacity: 0.7 }}>{l.org_name || "—"}</td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      {l.deals.length > 0
                        ? <span style={{ background: C.red, color: "#fff", borderRadius: "12px", padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}>{l.deals.length} deal{l.deals.length > 1 ? "s" : ""}</span>
                        : <span style={{ background: C.pink, color: C.red, borderRadius: "12px", padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}>New</span>
                      }
                    </td>
                    <td style={{ padding: "0.85rem 1rem", fontSize: "0.8rem", opacity: 0.5 }}>
                      {l.add_time ? new Date(l.add_time).toLocaleDateString("lt-LT") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
