import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// localStorage is always the primary local cache (fast, works offline).
// Supabase is synced on top for cross-device persistence when logged in.
export function usePlannerData(programId) {
  const { user } = useAuth();
  const [pathId, setPathIdState]  = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const userRef   = useRef(user);
  const pathIdRef = useRef(pathId);
  const saveTimer = useRef(null);

  useEffect(() => { userRef.current = user; },   [user]);
  useEffect(() => { pathIdRef.current = pathId; }, [pathId]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  function readLocalPath() {
    try { return JSON.parse(localStorage.getItem(`uwcompass-path-${programId}`)); }
    catch { return null; }
  }

  function readLocalCompleted() {
    try {
      const raw = localStorage.getItem(`uwcompass-completed-${programId}`);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  }

  function writeLocal(pid, comp) {
    localStorage.setItem(`uwcompass-path-${programId}`,      JSON.stringify(pid));
    localStorage.setItem(`uwcompass-completed-${programId}`, JSON.stringify(comp));
  }

  // ── Load ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Always show localStorage data immediately — no loading spinner.
    setPathIdState(readLocalPath());
    setCompleted(readLocalCompleted());
    setIsLoading(false);

    // For logged-in users, quietly sync from Supabase in the background.
    // If Supabase has newer data (e.g. from another device), it updates the UI.
    if (user) syncFromSupabase(user);
  }, [user?.id, programId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function syncFromSupabase(currentUser) {
    try {
      const { data, error } = await supabase
        .from('user_planners')
        .select('path_id, completed')
        .eq('user_id', currentUser.id)
        .eq('program_id', programId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Supabase has a record — it's authoritative for cross-device sync.
        setPathIdState(data.path_id);
        setCompleted(new Set(data.completed ?? []));
        writeLocal(data.path_id, data.completed ?? []);
      } else {
        // First login for this program — push localStorage data to Supabase.
        const pid  = readLocalPath();
        const comp = readLocalCompleted();
        if (pid || comp.size > 0) {
          await upsert(currentUser.id, pid, [...comp]);
        }
      }
    } catch (err) {
      console.error('[usePlannerData] Supabase sync failed, using localStorage:', err);
    }
  }

  // ── Persist ────────────────────────────────────────────────────────────────
  async function upsert(userId, pid, comp) {
    const { error } = await supabase.from('user_planners').upsert(
      { user_id: userId, program_id: programId, path_id: pid, completed: comp },
      { onConflict: 'user_id,program_id' },
    );
    if (error) console.error('[usePlannerData] upsert failed:', error);
  }

  // Debounce Supabase writes — localStorage write is always immediate above.
  function scheduleSupabaseSave(pid, comp) {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (userRef.current) upsert(userRef.current.id, pid, comp);
    }, 600);
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  const setPathId = useCallback((newPathId) => {
    setPathIdState(newPathId);
    writeLocal(newPathId, [...completed]);
    if (userRef.current) scheduleSupabaseSave(newPathId, [...completed]);
  }, [programId, completed]); // eslint-disable-line react-hooks/exhaustive-deps

  const replaceCompleted = useCallback((newSet) => {
    setCompleted(newSet);
    writeLocal(pathIdRef.current, [...newSet]);
    if (userRef.current) scheduleSupabaseSave(pathIdRef.current, [...newSet]);
  }, [programId]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleCompleted = useCallback((code) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      writeLocal(pathIdRef.current, [...next]);
      if (userRef.current) scheduleSupabaseSave(pathIdRef.current, [...next]);
      return next;
    });
  }, [programId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { pathId, setPathId, completed, replaceCompleted, toggleCompleted, isLoading };
}
