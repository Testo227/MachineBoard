import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Search, LogOut, KeyRound, HelpCircle, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import FiltersPanel from "./FiltersPanel";

// Deterministic fallback color from a string
const AVATAR_COLORS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#f97316",
  "#14b8a6", "#22c55e", "#ef4444", "#6366f1",
];
function getAvatarColor(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ── Password change portal modal ──────────────────────────────────────────────
const ChangePasswordModal = ({ onClose }) => {
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputCls = "w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgb(255,204,0)] focus:bg-white focus:border-transparent transition";

  const handleSave = async () => {
    setError("");
    if (newPw.length < 6) return setError("Mindestens 6 Zeichen.");
    if (newPw !== confirmPw) return setError("Passwörter stimmen nicht überein.");
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPw });
    setLoading(false);
    if (updateError) return setError("Fehler: " + updateError.message);
    setSuccess(true);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-[rgb(70,75,82)] px-5 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-base">Passwort ändern</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white text-2xl leading-none cursor-pointer">×</button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          {success ? (
            <p className="text-green-600 text-sm font-medium text-center py-2">✅ Passwort erfolgreich geändert.</p>
          ) : (
            <>
              {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Neues Passwort</label>
                <input className={inputCls} type="password" placeholder="Mindestens 6 Zeichen" value={newPw} onChange={e => setNewPw(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bestätigen</label>
                <input className={inputCls} type="password" placeholder="Passwort wiederholen" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSave()} />
              </div>
            </>
          )}
        </div>
        <div className="px-5 pb-5 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition cursor-pointer">
            {success ? "Schließen" : "Abbrechen"}
          </button>
          {!success && (
            <button onClick={handleSave} disabled={loading} className="px-5 py-2 rounded-lg bg-[rgb(255,204,0)] text-[rgb(40,44,48)] text-sm font-bold hover:brightness-95 transition cursor-pointer disabled:opacity-60 flex items-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-t-transparent border-[rgb(40,44,48)] rounded-full animate-spin" /> : "Speichern"}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

// ── Help portal modal ─────────────────────────────────────────────────────────
const HelpModal = ({ onClose }) => ReactDOM.createPortal(
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
    <div className="absolute inset-0" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
      <div className="bg-[rgb(70,75,82)] px-5 py-4 flex items-center justify-between">
        <h2 className="text-white font-bold text-base">Hilfe</h2>
        <button onClick={onClose} className="text-white/50 hover:text-white text-2xl leading-none cursor-pointer">×</button>
      </div>
      <div className="p-5 flex flex-col gap-3 text-sm text-gray-600">
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2">
          <p className="font-bold text-[rgb(85,90,90)] text-xs uppercase tracking-wider">Shopfloorboard PCP Aichtal</p>
          <ul className="flex flex-col gap-1.5 text-xs text-gray-500">
            <li><span className="font-semibold text-gray-700">Maschine erstellen:</span> Auf ein leeres Slot klicken (+)</li>
            <li><span className="font-semibold text-gray-700">Maschine bearbeiten:</span> Auf eine Maschinenkarte klicken</li>
            <li><span className="font-semibold text-gray-700">Verschieben:</span> Karte per Drag & Drop auf einen anderen Slot ziehen</li>
            <li><span className="font-semibold text-gray-700">Tauschen:</span> Karte auf einen belegten Slot ziehen → Maschinen tauschen</li>
            <li><span className="font-semibold text-gray-700">Filtern:</span> Suchfeld oder Filter-Button oben rechts</li>
          </ul>
        </div>
        <p className="text-xs text-gray-400 text-center">Bei Problemen: J. Wörn kontaktieren</p>
      </div>
      <div className="px-5 pb-5 flex justify-end">
        <button onClick={onClose} className="px-5 py-2 rounded-lg bg-[rgb(255,204,0)] text-[rgb(40,44,48)] text-sm font-bold hover:brightness-95 transition cursor-pointer">
          OK
        </button>
      </div>
    </div>
  </div>,
  document.body
);

// ── Main Topbar ───────────────────────────────────────────────────────────────
const Topbar = ({ filters, setFilters, globalTags, user, setUser }) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (value) => setFilters((prev) => ({ ...prev, search: value }));

  const clearAllFilters = () => {
    setFilters({
      search: "", tags: [], typ: "", typBezeichung: "", wlw: "",
      sequenzFilter: {
        area: ["PPM1","PPM2","PUMI","Dock","Prüffeld Pumpe","Prüffeld Mast","Lackierung","Endmontage","PDI","Konservieren","Optimieren","BSA Linie","BSA Dock"],
        type: ["Plan", "Ist"], type2: ["start","ende"], from: "", till: "",
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  const sf = filters.sequenzFilter || {};
  const isAnyFilterActive =
    Boolean(filters.search?.trim()) || (filters.tags?.length > 0) ||
    Boolean(filters.typ?.trim()) || Boolean(filters.typBezeichung?.trim()) ||
    Boolean(sf.selectedArea?.trim()) || Boolean(sf.selectedType?.trim()) ||
    Boolean(sf.selectedType2?.trim()) || Boolean(sf.from) || Boolean(sf.till);

  // Avatar
  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("").toUpperCase()
    || user?.email?.[0]?.toUpperCase() || "?";
  const avatarBg = user?.profileColor || getAvatarColor(user?.email || user?.id || "");
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.displayName || user?.email || "Benutzer";

  return (
    <>
      <div className="flex bg-[rgb(255,204,0)] h-8 items-center justify-between px-3 shadow-md relative">

        {/* ── Avatar (left) ── */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(prev => !prev)}
            className="flex items-center gap-1.5 rounded-full hover:bg-black/10 pl-0.5 pr-2 py-0.5 transition cursor-pointer"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ backgroundColor: avatarBg }}
            >
              <span className="text-white font-bold leading-none select-none" style={{ fontSize: "9px" }}>{initials}</span>
            </div>
            <ChevronDown
              size={10}
              className={`text-[rgb(85,90,90)] transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
            />
          </button>

          {/* ── Dropdown ── */}
          {showUserMenu && (
            <div className="absolute left-0 top-full mt-1.5 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">

              {/* User info header */}
              <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: avatarBg }}>
                  <span className="text-white font-bold text-sm select-none">{initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[rgb(85,90,90)] truncate">{fullName}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="py-1">
                <button
                  onClick={() => { setShowUserMenu(false); setShowChangePw(true); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  <KeyRound size={14} className="text-gray-400 flex-shrink-0" />
                  Passwort ändern
                </button>
                <button
                  onClick={() => { setShowUserMenu(false); setShowHelp(true); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  <HelpCircle size={14} className="text-gray-400 flex-shrink-0" />
                  Hilfe
                </button>
              </div>

              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition cursor-pointer"
                >
                  <LogOut size={14} className="flex-shrink-0" />
                  Abmelden
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Title (centered) ── */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-sm font-extrabold text-[rgb(85,90,90)] select-none whitespace-nowrap">
          Shopfloorboard PCP Aichtal
        </h1>

        {/* ── Search + Filter (right) ── */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative w-52">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={11} />
            <input
              className="w-full bg-white pl-7 pr-2 py-0.5 rounded border border-gray-300 text-gray-700 text-xs focus:outline-none focus:ring-1 focus:ring-[rgb(85,90,90)] focus:border-transparent shadow-sm"
              placeholder="K-Nummer oder Kunde..."
              type="text"
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilterModal((prev) => !prev)}
              className={`bg-white px-2.5 py-0.5 rounded shadow-sm border text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-100 transition-all duration-200 ${
                isAnyFilterActive ? "ring-2 ring-[rgb(85,90,90)]" : "border-gray-300"
              }`}
            >
              Filter
              {isAnyFilterActive && <span className="w-1.5 h-1.5 bg-[rgb(228,12,12)] rounded-full inline-block" />}
            </button>

            {showFilterModal && (
              <div className="absolute right-0 mt-1 w-145 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
                <FiltersPanel filters={filters} setFilters={setFilters} globalTags={globalTags} clearAllFilters={clearAllFilters} />
              </div>
            )}
          </div>
        </div>
      </div>

      {showChangePw && <ChangePasswordModal onClose={() => setShowChangePw(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
};

export default Topbar;
