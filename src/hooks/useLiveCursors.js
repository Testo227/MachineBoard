import { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

const AVATAR_COLORS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#f97316",
  "#14b8a6", "#22c55e", "#ef4444", "#6366f1",
];
function getAvatarColor(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function useLiveCursors(user) {
  const [remoteCursors, setRemoteCursors] = useState({});
  const [onlineUsers, setOnlineUsers]     = useState([]);
  const channelRef   = useRef(null);
  const userInfoRef  = useRef(null);
  const lastTrackRef = useRef(0);

  useEffect(() => {
    if (!user?.id) return;

    // Only use real first+last name — no email fallback for label
    const firstName = user.firstName || '';
    const lastName  = user.lastName  || '';
    const name      = [firstName, lastName].filter(Boolean).join(' ');
    const initials  = ([firstName[0], lastName[0]].filter(Boolean).join('').toUpperCase())
      || user.email?.[0]?.toUpperCase() || '?';
    const color     = user.profileColor || getAvatarColor(user.email || user.id || '');

    userInfoRef.current = { name, initials, color };

    const channel = supabase.channel('live-cursors', {
      config: { presence: { key: user.id } },
    });

    const syncUsers = () => {
      const state = channel.presenceState();
      setRemoteCursors({ ...state });
      const users = Object.entries(state).map(([id, arr]) => ({
        id,
        ...(arr[0] || {}),
        isMe: id === user.id,
      }));
      setOnlineUsers(users);
    };

    channel
      .on('presence', { event: 'sync' }, syncUsers)
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ ...userInfoRef.current, x: -1, y: -1 });
        }
      });

    channelRef.current = channel;

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTrackRef.current < 50) return;
      lastTrackRef.current = now;
      channel.track({
        ...userInfoRef.current,
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { remoteCursors, currentUserId: user?.id, onlineUsers };
}
