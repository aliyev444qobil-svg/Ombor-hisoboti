import { useState, useRef } from "react";

const initialProducts = [
  { id: 1, kod: "MH-001", rasm: null, nom: "Ko'ylak", rang: "Oq", olcham: "M", soni: 45, narx: 85000 },
  { id: 2, kod: "MH-002", rasm: null, nom: "Ko'ylak", rang: "Ko'k", olcham: "L", soni: 30, narx: 90000 },
  { id: 3, kod: "MH-003", rasm: null, nom: "Shim", rang: "Qora", olcham: "32", soni: 20, narx: 120000 },
  { id: 4, kod: "MH-004", rasm: null, nom: "Bluzon", rang: "Yashil", olcham: "XL", soni: 10, narx: 180000 },
  { id: 5, kod: "MH-005", rasm: null, nom: "Yubka", rang: "Qizil", olcham: "S", soni: 18, narx: 95000 },
];

const RANG_COLORS = {
  "Oq": "#f3f4f6", "Ko'k": "#bfdbfe", "Qora": "#d1d5db",
  "Yashil": "#bbf7d0", "Qizil": "#fecaca", "Sariq": "#fef08a",
  "Jigarrang": "#fed7aa", "Binafsha": "#ddd6fe", "Kulrang": "#e5e7eb",
};

function fmt(n) {
  return Number(n).toLocaleString("uz-UZ") + " so'm";
}
function RasmCell({ rasm, onChange }) {
  const ref = useRef();
  return (
    <div onClick={() => ref.current.click()} style={{
      width: 44, height: 44, borderRadius: 8, overflow: "hidden",
      border: "1.5px dashed #94a3b8", background: "#f8fafc",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", flexShrink: 0,
    }}>
      {rasm
        ? <img src={rasm} alt="mahsulot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <span style={{ fontSize: 18, color: "#94a3b8" }}>📷</span>
      }
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = ev => onChange(ev.target.result);
          reader.readAsDataURL(file);
        }}
      />
    </div>
  );
}

function Modal({ item, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({ ...item });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const fields = [
    { key: "kod", label: "Mahsulot kodi", type: "text", placeholder: "MH-001" },
    { key: "nom", label: "Mahsulot nomi", type: "text", placeholder: "Ko'ylak" },
    { key: "rang", label: "Rangi", type: "text", placeholder: "Oq" },
    { key: "olcham", label: "O'lchami", type: "text", placeholder: "M / L / 32" },
    { key: "soni", label: "Soni (dona)", type: "number", placeholder: "0" },
    { key: "narx", label: "Narxi (so'm)", type: "number", placeholder: "0" },
  ];
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
      zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: "20px 20px 0 0",
        width: "100%", maxWidth: 480, padding: "24px 20px 32px",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span style={{ fontWeight: 700, fontSize: 17, color: "#1e3a5f" }}>
            {item.id ? "Tahrirlash" : "Yangi mahsulot"}
          </span>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <div style={{
            width: 70, height: 70, borderRadius: 12, overflow: "hidden",
            border: "2px dashed #94a3b8", background: "#f1f5f9",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }} onClick={() => document.getElementById("modal-img-input").click()}>
            {form.rasm ? <img src={form.rasm} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
              : <span style={{ fontSize: 28, color: "#94a3b8" }}>📷</span>}
          </div>
          <div>
            <div style={{ fontSize: 13, color: "#64748b" }}>Mahsulot rasmi</div>
            <button onClick={() => document.getElementById("modal-img-input").click()}
              style={{ marginTop: 4, fontSize: 12, color: "#2563eb", border: "none", background: "none", cursor: "pointer", padding: 0 }}>
              Rasm yuklash
            </button>
            <input id="modal-img-input" type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => {
                const file = e.target.files[0];
                if (!file) return;
                const r = new FileReader();
                r.onload = ev => set("rasm", ev.target.result);
                r.readAsDataURL(file);
              }} />
          </div>
        </div>
        {fields.map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
            <input type={f.type} value={form[f.key] ?? ""} placeholder={f.placeholder}
              onChange={e => set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 15, outline: "none", background: "#f8fafc", boxSizing: "border-box" }} />
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          {item.id && (
            <button onClick={() => onDelete(item.id)} style={{ padding: "13px 16px", borderRadius: 12, border: "none", background: "#fee2e2", fontSize: 15, color: "#dc2626", cursor: "pointer" }}>🗑</button>
          )}
          <button onClick={onClose} style={{ flex: 1, padding: "13px 0", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: 15, fontWeight: 600, color: "#64748b", cursor: "pointer" }}>Bekor</button>
          <button onClick={() => onSave(form)} style={{ flex: 2, padding: "13px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#1e3a5f,#2563eb)", fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Saqlash ✓</button>
        </div>
      </div>
    </div>
  );
}
export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("jadval");

  const filtered = products.filter(p =>
    p.kod.toLowerCase().includes(search.toLowerCase()) ||
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.rang.toLowerCase().includes(search.toLowerCase())
  );

  const totalSoni = products.reduce((a, p) => a + Number(p.soni), 0);
  const totalSumma = products.reduce((a, p) => a + Number(p.soni) * Number(p.narx), 0);
  const avgNarx = products.length ? products.reduce((a, p) => a + Number(p.narx), 0) / products.length : 0;
  const maxItem = products.length ? products.reduce((a, b) => Number(b.soni) > Number(a.soni) ? b : a, products[0]) : {};

  const openEdit = (item) => setModal({ ...item });
  const openNew = () => setModal({ id: null, kod: "", rasm: null, nom: "", rang: "", olcham: "", soni: 0, narx: 0 });
  const handleSave = (form) => {
    if (form.id) setProducts(ps => ps.map(p => p.id === form.id ? form : p));
    else setProducts(ps => [...ps, { ...form, id: Date.now() }]);
    setModal(null);
  };
  const handleDelete = (id) => { setProducts(ps => ps.filter(p => p.id !== id)); setModal(null); };
  const updateRasm = (id, rasm) => setProducts(ps => ps.map(p => p.id === id ? { ...p, rasm } : p));

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#f0f4f8", minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", padding: "20px 16px 16px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "#93c5fd", fontWeight: 600, letterSpacing: 1 }}>ISHLAB CHIQARISH</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>Obor Hisoboti</div>
          </div>
          <button onClick={openNew} style={{ background: "#f59e0b", border: "none", borderRadius: 12, padding: "10px 16px", color: "#fff", fontWeight: 700, fontSize: 20, cursor: "pointer" }}>＋</button>
        </div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Kod, nom yoki rang..."
            style={{ width: "100%", padding: "10px 12px 10px 38px", borderRadius: 10, border: "none", fontSize: 14, background: "rgba(255,255,255,0.15)", color: "#fff", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {[["jadval","📋 Jadval"],["tahlil","📊 Tahlil"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: tab === key ? "#fff" : "rgba(255,255,255,0.15)", color: tab === key ? "#1e3a5f" : "#fff", fontWeight: tab === key ? 700 : 500, fontSize: 13, cursor: "pointer" }}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "12px 12px 0" }}>
        {[{ label: "Mahsulotlar", val: products.length + " tur" }, { label: "Umumiy soni", val: totalSoni.toLocaleString() + " dona" }, { label: "Jami summa", val: (totalSumma/1000000).toFixed(1) + " mln" }].map(s => (
          <div key={s.label} style={{ flex: 1, background: "#fff", borderRadius: 12, padding: "10px 8px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1e3a5f" }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {tab === "jadval" && (
        <div style={{ padding: "10px 12px 100px" }}>
          {filtered.map((p, i) => {
            const rangBg = RANG_COLORS[p.rang] || "#f1f5f9";
            return (
              <div key={p.id} onClick={() => openEdit(p)} style={{ background: "#fff", borderRadius: 14, padding: "12px", marginBottom: 10, boxShadow: "0 1px 6px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", borderLeft: `4px solid ${i%3===0?"#2563eb":i%3===1?"#f59e0b":"#10b981"}` }}>
                <RasmCell rasm={p.rasm} onChange={rasm => updateRasm(p.id, rasm)} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", background: "#eff6ff", padding: "2px 7px", borderRadius: 20 }}>{p.kod}</span>
                    <span style={{ fontSize: 11, background: rangBg, padding: "2px 7px", borderRadius: 20 }}>{p.rang}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{p.nom}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>O'lcham: <b>{p.olcham}</b> · Soni: <b>{p.soni}</b></div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>{Number(p.narx).toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>so'm/dona</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#059669", marginTop: 4 }}>{(p.soni*p.narx/1000).toFixed(0)}K</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {tab === "tahlil" && (
        <div style={{ padding: "12px 12px 100px" }}>
          <div style={{ background: "linear-gradient(135deg,#1e3a5f,#2563eb)", borderRadius: 16, padding: "20px", marginBottom: 12, color: "#fff" }}>
            <div style={{ fontSize: 12, color: "#93c5fd", marginBottom: 4 }}>JAMI AYLANMA</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{fmt(totalSumma)}</div>
            <div style={{ fontSize: 13, color: "#bfdbfe", marginTop: 4 }}>{products.length} xil · {totalSoni} dona</div>
          </div>
          {[
            { icon: "📦", label: "Eng ko'p sotiladigan", val: maxItem?.nom || "—", sub: (maxItem?.soni||0)+" dona" },
            { icon: "💰", label: "O'rtacha narx", val: fmt(Math.round(avgNarx)), sub: "" },
            { icon: "🔝", label: "Eng qimmat", val: products.length ? fmt(Math.max(...products.map(p=>p.narx))) : "—", sub: "" },
            { icon: "🔻", label: "Eng arzon", val: products.length ? fmt(Math.min(...products.map(p=>p.narx))) : "—", sub: "" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
              <span style={{ fontSize: 26 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{s.val}</div>
                {s.sub && <div style={{ fontSize: 11, color: "#94a3b8" }}>{s.sub}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#1e3a5f", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, color: "#93c5fd" }}>Jami summa</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#f59e0b" }}>{fmt(totalSumma)}</div>
        </div>
        <button onClick={openNew} style={{ background: "#f59e0b", border: "none", borderRadius: 12, padding: "10px 20px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>+ Qo'shish</button>
      </div>
      {modal && <Modal item={modal} onClose={() => setModal(null)} onSave={handleSave} onDelete={handleDelete} />}
    </div>
  );
}
