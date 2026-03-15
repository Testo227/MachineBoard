import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useToast } from './ToastContext';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#f97316",
  "#14b8a6", "#22c55e", "#ef4444", "#6366f1",
];
function getAvatarColor(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatTime(iso) {
  if (!iso) return '';
  const date  = new Date(iso);
  const diff  = Math.floor((Date.now() - date) / 1000);
  const dateStr = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const timeStr = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  if (diff < 60)    return `Gerade eben · ${dateStr}, ${timeStr}`;
  if (diff < 3600)  return `vor ${Math.floor(diff / 60)} Min. · ${dateStr}, ${timeStr}`;
  if (diff < 86400) return `vor ${Math.floor(diff / 3600)} Std. · ${dateStr}, ${timeStr}`;
  return `${dateStr} · ${timeStr}`;
}

// ── Avatar ────────────────────────────────────────────────────────────────────

const Avatar = ({ firstName, lastName, profileColor, email, userId, size = 'sm' }) => {
  const f = firstName?.trim() || '';
  const l = lastName?.trim()  || '';
  const initials = ((f[0] || '') + (l[0] || '')).toUpperCase() || email?.[0]?.toUpperCase() || '?';
  const bg  = profileColor || getAvatarColor(email || userId || f + l);
  const dim = size === 'md' ? 32 : 26;
  const fs  = size === 'md' ? 12 : 10;
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
      style={{ width: dim, height: dim, backgroundColor: bg }}>
      <span className="text-white font-bold leading-none select-none" style={{ fontSize: fs }}>
        {initials}
      </span>
    </div>
  );
};

// ── Render text — @mentions as blue ──────────────────────────────────────────

function renderText(text) {
  if (!text) return null;
  return text.split(/(@\S+)/g).map((part, i) =>
    part.startsWith('@')
      ? <span key={i} className="text-blue-500 font-semibold cursor-default">{part}</span>
      : part
  );
}

// ── @Mention textarea ─────────────────────────────────────────────────────────

const MentionInput = ({ value, onChange, onSubmit, profiles, placeholder, rows = 3 }) => {
  const [open, setOpen]        = useState(false);
  const [query, setQuery]      = useState('');
  const [replaceFrom, setFrom] = useState(0);
  const ref = useRef(null);

  const filtered = profiles
    .filter(p => !query || `${p.first_name} ${p.last_name}`.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  const handleChange = (e) => {
    const val    = e.target.value;
    const cursor = e.target.selectionStart;
    onChange(val);
    const m = val.slice(0, cursor).match(/@([a-zA-ZÄÖÜäöüß.]*)$/);
    if (m) { setQuery(m[1]); setFrom(cursor - m[0].length); setOpen(true); }
    else   { setOpen(false); }
  };

  const pick = (profile) => {
    const tag    = `@${profile.first_name}.${profile.last_name}`;
    const cursor = ref.current?.selectionStart ?? value.length;
    const m      = value.slice(0, cursor).match(/@([a-zA-ZÄÖÜäöüß.]*)$/);
    const from   = m ? cursor - m[0].length : replaceFrom;
    onChange(value.slice(0, from) + tag + ' ' + value.slice(cursor));
    setOpen(false);
    setTimeout(() => ref.current?.focus(), 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape')                        { setOpen(false); return; }
    if (e.key === 'Enter' && !e.shiftKey && !open) { e.preventDefault(); onSubmit?.(); }
  };

  return (
    <div className="relative">
      <textarea ref={ref} value={value} onChange={handleChange} onKeyDown={handleKeyDown}
        placeholder={placeholder} rows={rows}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgb(255,204,0)] focus:bg-white focus:border-transparent transition resize-none"
      />
      {open && filtered.length > 0 && (
        <div className="absolute bottom-full mb-1.5 left-0 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-1.5 border-b border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Erwähnen</span>
          </div>
          {filtered.map(p => (
            <button key={p.id} type="button" onMouseDown={e => { e.preventDefault(); pick(p); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-blue-50 transition text-left group">
              <Avatar firstName={p.first_name} lastName={p.last_name} profileColor={p.profile_color} email={p.email} userId={p.id} size="sm" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">
                {p.first_name} {p.last_name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Email notifications ────────────────────────────────────────────────────────

async function sendMentionNotifications(text, profiles, currentUser) {
  const matches = [...text.matchAll(/@([a-zA-ZÄÖÜäöüß]+\.[a-zA-ZÄÖÜäöüß]+)/g)];
  if (!matches.length) return;
  const handles   = matches.map(m => m[1].toLowerCase());
  const mentioned = profiles.filter(p =>
    handles.includes(`${p.first_name}.${p.last_name}`.toLowerCase()) && p.id !== currentUser?.id
  );
  for (const p of mentioned) {
    await supabase.functions.invoke('notify-mention', {
      body: { toEmail: p.email, toName: `${p.first_name} ${p.last_name}`,
              fromName: currentUser.displayName, commentText: text },
    });
  }
}

// ── Inline reply input ────────────────────────────────────────────────────────

const ReplyInput = ({ onSubmit, onCancel, profiles, targetName }) => {
  const [text, setText]    = useState('');
  const [posting, setPost] = useState(false);

  const submit = async () => {
    if (!text.trim() || posting) return;
    setPost(true);
    await onSubmit(text.trim());
    setPost(false);
    setText('');
  };

  return (
    <div className="mt-2 flex flex-col gap-2">
      <MentionInput value={text} onChange={setText} onSubmit={submit} profiles={profiles}
        placeholder={`${targetName} antworten… (Enter zum Senden)`} rows={2} />
      <div className="flex justify-end gap-2">
        <button onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition cursor-pointer">
          Abbrechen
        </button>
        <button onClick={submit} disabled={posting || !text.trim()}
          className="px-4 py-1.5 rounded-lg bg-[rgb(255,204,0)] text-[rgb(40,44,48)] text-xs font-bold hover:brightness-95 transition cursor-pointer disabled:opacity-60 flex items-center gap-1.5">
          {posting ? <div className="w-3 h-3 border-2 border-t-transparent border-[rgb(40,44,48)] rounded-full animate-spin" /> : 'Senden'}
        </button>
      </div>
    </div>
  );
};

// ── Recursive comment node ────────────────────────────────────────────────────

const CommentNode = ({ comment, allComments, profileMap, profiles, currentUser, onPosted, depth = 0 }) => {
  const [replying,    setReplying]    = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(false);
  const { addToast } = useToast();

  const p = profileMap[comment.user_id] || null;

  // Name priority: stored author_name → profile lookup → email-based fallback
  const authorName = comment.author_name?.trim()
    || (p ? `${p.first_name} ${p.last_name}`.trim() : '')
    || comment.user_id?.slice(0, 8)
    || 'Benutzer';

  // For avatar initials: split authorName if no separate first/last available
  const parts     = authorName.split(' ');
  const firstName = p?.first_name  || parts[0] || '';
  const lastName  = p?.last_name   || parts[1] || '';
  const avatarColor = comment.author_profile_color || p?.profile_color || '';
  const avatarEmail = p?.email || '';

  const children   = allComments.filter(c => c.parent_id === comment.id);
  const replyCount = children.length;
  const indent     = Math.min(depth, 3) * 24;

  const handleReply = async (text) => {
    const { error } = await supabase.from('kommentare').insert({
      machine_id:          comment.machine_id,
      user_id:             currentUser.id,
      text,
      parent_id:           comment.id,
      author_name:         currentUser.displayName,
      author_profile_color: currentUser.profileColor,
    });
    if (error) { addToast('❌ Fehler beim Antworten', 'error'); return; }
    sendMentionNotifications(text, profiles, currentUser);
    setReplying(false);
    setRepliesOpen(true);
    onPosted();
  };

  return (
    <div style={{ marginLeft: indent }}>
      <div className="flex gap-2.5 items-start">
        <Avatar firstName={firstName} lastName={lastName}
          profileColor={avatarColor} email={avatarEmail}
          userId={comment.user_id}
          size={depth === 0 ? 'md' : 'sm'} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1 px-0.5">
            <span className="text-sm font-bold text-[rgb(85,90,90)]">{authorName}</span>
            <span className="text-xs text-gray-400">{formatTime(comment.created_at)}</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 shadow-sm">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {renderText(comment.text)}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1 ml-0.5">
            <button onClick={() => setReplying(v => !v)}
              className="text-xs text-gray-400 hover:text-blue-500 font-medium transition cursor-pointer">
              {replying ? 'Abbrechen' : 'Antworten'}
            </button>
            {replyCount > 0 && (
              <button onClick={() => setRepliesOpen(v => !v)}
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-medium transition cursor-pointer">
                <MessageCircle size={11} />
                {replyCount} {replyCount === 1 ? 'Antwort' : 'Antworten'}
                {repliesOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
            )}
          </div>
          {replying && (
            <ReplyInput onSubmit={handleReply} onCancel={() => setReplying(false)}
              profiles={profiles} targetName={authorName} />
          )}
        </div>
      </div>

      {replyCount > 0 && repliesOpen && (
        <div className="mt-2 ml-3.5 pl-3 border-l-2 border-gray-100 flex flex-col gap-3">
          {children.map(child => (
            <CommentNode key={child.id} comment={child} allComments={allComments}
              profileMap={profileMap} profiles={profiles} currentUser={currentUser}
              onPosted={onPosted} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main export ───────────────────────────────────────────────────────────────

const Comments = ({ machineId }) => {
  const [comments,    setComments]    = useState([]);
  const [profileMap,  setProfileMap]  = useState({});
  const [profiles,    setProfiles]    = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newText,     setNewText]     = useState('');
  const [posting,     setPosting]     = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data?.session?.user;
      if (!u) return;
      const firstName    = u.user_metadata?.firstName    || '';
      const lastName     = u.user_metadata?.lastName     || '';
      const profileColor = u.user_metadata?.profileColor || '';
      const emailHandle  = u.email?.split('@')[0]?.replace(/[._]/g, ' ') || '';
      const displayName  = (firstName + ' ' + lastName).trim() || emailHandle || u.email || 'Benutzer';
      setCurrentUser({ id: u.id, email: u.email, firstName, lastName, displayName, profileColor });

      // Ensure this user exists in profiles so @mention dropdown is populated
      if (firstName || lastName) {
        await supabase.from('profiles').upsert({
          id: u.id,
          first_name:    firstName,
          last_name:     lastName,
          email:         u.email,
          profile_color: profileColor,
        }, { onConflict: 'id' });
      }
    });
  }, []);

  const loadProfiles = useCallback(async () => {
    const { data } = await supabase.from('profiles')
      .select('id, first_name, last_name, profile_color, email').order('first_name');
    if (data) setProfiles(data);
  }, []);

  const loadComments = useCallback(async () => {
    const { data } = await supabase.from('kommentare').select('*')
      .eq('machine_id', machineId).order('created_at', { ascending: true });
    if (!data) return;
    const real = data.filter(c => c.text?.trim());
    const userIds = [...new Set(real.map(c => c.user_id).filter(Boolean))];
    let map = {};
    if (userIds.length > 0) {
      const { data: pData } = await supabase.from('profiles')
        .select('id, first_name, last_name, profile_color, email').in('id', userIds);
      if (pData) map = Object.fromEntries(pData.map(p => [p.id, p]));
    }
    setProfileMap(map);
    setComments(real);
  }, [machineId]);

  useEffect(() => { loadProfiles(); loadComments(); }, [loadProfiles, loadComments]);

  const postComment = async () => {
    if (!newText.trim() || posting || !currentUser) return;
    setPosting(true);
    const { error } = await supabase.from('kommentare').insert({
      machine_id:           machineId,
      user_id:              currentUser.id,
      text:                 newText.trim(),
      parent_id:            null,
      author_name:          currentUser.displayName,
      author_profile_color: currentUser.profileColor,
    });
    setPosting(false);
    if (error) { addToast('❌ Fehler beim Kommentieren', 'error'); return; }
    sendMentionNotifications(newText, profiles, currentUser);
    setNewText('');
    loadComments();
  };

  const topLevel = comments.filter(c => !c.parent_id);

  return (
    <div className="flex flex-col gap-4">
      {topLevel.length === 0 ? (
        <p className="text-xs text-center text-gray-400 py-1">Noch keine Kommentare.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {topLevel.map(comment => (
            <CommentNode key={comment.id} comment={comment} allComments={comments}
              profileMap={profileMap} profiles={profiles} currentUser={currentUser}
              onPosted={loadComments} depth={0} />
          ))}
        </div>
      )}
      <div className="flex gap-2.5 items-start pt-3 border-t border-gray-100">
        {currentUser && (
          <Avatar firstName={currentUser.firstName} lastName={currentUser.lastName}
            profileColor={currentUser.profileColor} email={currentUser.email}
            userId={currentUser.id} size="md" />
        )}
        <div className="flex-1 flex flex-col gap-2">
          <MentionInput value={newText} onChange={setNewText} onSubmit={postComment}
            profiles={profiles} placeholder="Kommentar schreiben… (@ erwähnen, Enter zum Senden)" />
          <div className="flex justify-end">
            <button onClick={postComment} disabled={posting || !newText.trim() || !currentUser}
              className="px-5 py-2 rounded-lg bg-[rgb(255,204,0)] text-[rgb(40,44,48)] text-sm font-bold hover:brightness-95 transition cursor-pointer disabled:opacity-60 flex items-center gap-2">
              {posting ? <div className="w-4 h-4 border-2 border-t-transparent border-[rgb(40,44,48)] rounded-full animate-spin" /> : 'Kommentieren'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
