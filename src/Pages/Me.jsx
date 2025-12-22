import { useState, useEffect, use } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Components/NavBar";
import AuthInit from "../State/AuthInit";
import { getMe } from "../fetching-data.js";
import { updateMe } from "../fetching-data.js";

export default function ProfileCard() {
  const { user, status } = useSelector((s) => s.auth);
  const [me, setMe] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [btnSaved = setBtnSaved] = useState(false)

  if (status != "authed") return;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getUser = async () => {
    const data = await getMe(); // must return user object
    console.log('user data', data);
    setMe(data);
  };

   useEffect(() => {
    if (!me) return;
    setFirstName(me.first_name ?? "");
    setLastName(me.last_name ?? "");
  }, [me]);

  useEffect(() => {
    if (status !== "authed") return;
    getUser();
  }, [status]);

  const handleSave = async () => {
    const res = await updateMe({ first_name: firstName, last_name: lastName });
    // console.log("updated:", res);
    if (!res?.error) setMe(res); // so UI updates instantly
  };

  console.log('--> me', me);

  const userInitials = user?.username ? user.username.slice(0, 2).toUpperCase() : null;

  return (
    <>
      {/* <AuthInit/> */}
      <div className="bg-gray-100 min-h-screen">
        <Navbar />

        <div className="mx-auto max-w-5xl p-4 mt-10 md:p-8">
          <section className="rounded-2xl border border-gray-200 bg-white/90 shadow-sm">
            {/* Card padding */}
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Header */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {/* Avatar + camera button */}
                <div className="relative h-28 w-28 shrink-0">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-200 ring-4 ring-white">
                    <span className="select-none text-3xl font-semibold text-gray-700">
                      {(((userInitials ?? "")) || "user").toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Name + email */}
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {user.username || "Name"}
                  </h1>
                  <p className="flex items-center gap-2 text-gray-500">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M20 4H4a2 2 0 0 0-2 2v.4l10 6.25L22 6.4V6a2 2 0 0 0-2-2zm0 6.2l-8 5-8-5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.8z" />
                    </svg>
                    {me?.email || "email@gmail.com"}
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Персональні дані
                  </h2>
                </div>

                {/* first name */}
                <div><label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Ім’я</label>
                <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none ring-0 transition placeholder:text-gray-600 focus:border-blue-400"
                />
              </div>

              {/* last name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700" > Прізвище</label>
                <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-400"
                />
              </div>

                {/* Save */}
                <div className="md:col-span-2 mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  className=
                  {`cursor-pointer inline-flex items-center justify-center rounded-xl bg-blue-700 hover:bg-blue-800 px-6 py-3 text-sm font-medium text-white shadow-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 `}
                >
                  Зберегти
                </button>
              </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
