import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Abstracts planner storage: Supabase when logged in, localStorage for guests.
// On first login, automatically migrates existing localStorage data to Supabase.
export function usePlannerData(programId) {
  const { user } = useAuth();
  const [pathId, setPathIdState]   = useState(null);
  const [completed, setCompleted]  = useState(new Set());
  const [isLoading, setIsLoading]  = useState(true);

  // Refs to avoid stale closures in debounced save callbacks
  const userRef      = useRef(user);
  const pathIdRef    = useRef(pathId);
  const saveTimer    = useRef(null);

  useEffect(() => { userRef.current = user; },   [user]);
  useEffect(() => { pathIdRef.current = pathId; }, [pathId]);

  // ── Load ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    setIsLoading(true);
    if (user) {
      loadFromSupabase(user);
    } else {
      setPathIdState(readLocalPath());
      setCompleted(readLocalCompleted());
      setIsLoading(false);
    }
  }, [user?.id, programId]); // eslint-disable-line react-hooks/exhaustive-deps

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

  async function loadFromSupabase(currentUser) {
    try {
      const { data, error } = await supabase
        .from('user_planners')
        .select('path_id, completed')
        .eq('user_id', currentUser.id)
        .eq('program_id', programId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPathIdState(data.path_id);
        setCompleted(new Set(data.completed ?? []));
      } else {
        // First login for this program — migrate localStorage data
        const pid  = readLocalPath();
        const comp = readLocalCompleted();
        setPathIdState(pid);
        setCompleted(comp);
        if (pid || comp.size > 0) {
          await upsert(currentUser.id, pid, [...comp]);
        }
      }
    } catch (err) {
      console.error('[usePlannerData] load failed:', err);
      setPathIdState(readLocalPath());
      setCompleted(readLocalCompleted());
    } finally {
      setIsLoading(false);
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

  // Debounce writes so rapid course toggles don't flood Supabase
  function scheduleSave(pid, comp) {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (userRef.current) upsert(userRef.current.id, pid, comp);
    }, 600);
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  const setPathId = useCallback((newPathId) => {
    setPathIdState(newPathId);
    if (userRef.current) {
      scheduleSave(newPathId, [...completed]);
    } else {
      localStorage.setItem(`uwcompass-path-${programId}`, JSON.stringify(newPathId));
    }
  }, [programId, completed]); // eslint-disable-line react-hooks/exhaustive-deps

  // Replace the whole completed set (used when switching career paths)
  const replaceCompleted = useCallback((newSet) => {
    setCompleted(newSet);
    if (userRef.current) {
      scheduleSave(pathIdRef.current, [...newSet]);
    } else {
      localStorage.setItem(`uwcompass-completed-${programId}`, JSON.stringify([...newSet]));
    }
  }, [programId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle a single course
  const toggleCompleted = useCallback((code) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      if (userRef.current) {
        scheduleSave(pathIdRef.current, [...next]);
      } else {
        localStorage.setItem(`uwcompass-completed-${programId}`, JSON.stringify([...next]));
      }
      return next;
    });
  }, [programId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { pathId, setPathId, completed, replaceCompleted, toggleCompleted, isLoading };
}
