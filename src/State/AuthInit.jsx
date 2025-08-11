// src/state/AuthInit.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading, setUser, setError } from "./authSlice";
import { getMe } from "../fetching-data";
export default function AuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadUser() {
      try {
        dispatch(setLoading());
        const res = await fetch("http://127.0.0.1:8000/api/auth/users/me", { credentials: "include" });
        const data = res.ok ? await res.json() : null;
        console.log("[AUTHINIT] data", data);
        dispatch(setUser(data));
      } catch (err) {
        dispatch(setError(err.message));
      }
    }
    loadUser();
  }, []);

  return <></>; // no UI
}
