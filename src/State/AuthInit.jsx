// src/state/AuthInit.jsx
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setLoading, setUser, setError } from "./authSlice";
// import { SERVER_URL } from "../../dev_data.js";

export default function AuthInit() {
  // const dispatch = useDispatch();
  // const { status } = useSelector(s => s.auth); // restored from storage

  // useEffect(() => {
  //   let cancelled = false;

  //   async function loadUser() {
  //     try {
  //       // Only show loading spinner if we’re not already authed
  //       if (status !== 'authed') dispatch(setLoading());

  //       const res = await fetch(`${SERVER_URL}/api/auth/users/me`, { credentials: "include" });
  //       if (res.ok) {
  //         const data = await res.json();
  //         if (!cancelled) dispatch(setUser(data));
  //       } else {
  //         // Do not downgrade an already authed user if the refresh call fails
  //         if (!cancelled && status !== 'authed') dispatch(setUser(null));
  //       }
  //     } catch (err) {
  //       if (!cancelled) dispatch(setError(err.message));
  //     }
  //   }

  //   // If we’re already authed (restored), you can skip the call or still refresh it:
  //   loadUser();
  //   return () => { cancelled = true; };
  // }, [dispatch]); // intentionally not depending on status to avoid loops

  return null;
}

