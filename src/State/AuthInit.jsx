// src/state/AuthInit.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser, setError } from "./authSlice";

export default function AuthInit() {
  const dispatch = useDispatch();
  const { status } = useSelector(s => s.auth); // restored from storage

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        // Only show loading spinner if we’re not already authed
        if (status !== 'authed') dispatch(setLoading());

        const res = await fetch("http://192.168.88.19:8000/api/users/me/", { credentials: "include" });
        const data = res.ok ? await res.json() : null;
        if (!cancelled) dispatch(setUser(data));
      } catch (err) {
        if (!cancelled) dispatch(setError(err.message));
      }
    }

    // If we’re already authed (restored), you can skip the call or still refresh it:
    loadUser();
    return () => { cancelled = true; };
  }, [dispatch]); // intentionally not depending on status to avoid loops

  return null;
}

