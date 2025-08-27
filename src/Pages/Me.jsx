import {  useState } from "react";
import { useSelector } from "react-redux"; 
import Navbar from "../Components/NavBar";
import AuthInit from "../State/AuthInit";

export default function ProfileCard() {
  const [avatar, setAvatar] = useState(null);
  const { user, status } = useSelector(s => s.auth);

  if(status != 'authed') return

  console.log('USER', user);
  console.log(user);
  return (
    <>
    {/* <AuthInit/> */}
    <div className="bg-gray-100 min-h-screen">
    <Navbar/>
    
    <div className="mx-auto max-w-5xl p-4 mt-10 md:p-8">
      <section className="rounded-2xl border border-gray-200 bg-white/90 shadow-sm dark:border-gray-700 dark:bg-gray-800/80">
        {/* Card padding */}
        <div className="p-6 sm:p-8 lg:p-10">
          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar + camera button */}
            <div className="relative h-28 w-28 shrink-0">
              <img
                src={
                  avatar ||
                  "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=300&auto=format&fit=crop"
                }
                alt="Avatar"
                className="h-28 w-28 rounded-full object-cover ring-4 ring-white dark:ring-gray-800"
              />
              <label
                htmlFor="avatar"
                className="absolute -right-1 -bottom-1 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-gray-700 shadow-md ring-1 ring-gray-200 transition hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-600"
                title="Змінити фото"
              >
                {/* simple camera icon via CSS */}
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M9 3l1.5 2H14l1.5-2H19a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4zM12 9a4 4 0 1 0 .001 8.001A4 4 0 0 0 12 9z" />
                </svg>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setAvatar(reader.result);
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>

            {/* Name + email */}
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {user.username || "Name"}
              </h1>
              <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M20 4H4a2 2 0 0 0-2 2v.4l10 6.25L22 6.4V6a2 2 0 0 0-2-2zm0 6.2l-8 5-8-5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.8z"/>
                </svg>
                {user.email || "email@gmail.com"}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Персональні дані
              </h2>
            </div>

            {/* First name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ім’я
              </label>
              <input
                id="firstName"
                placeholder={user.firstname || ""}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none ring-0 transition placeholder:text-gray-600 focus:border-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Last name */}
            <div>
              <div className="flex items-center gap-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Прізвище
                </label>
                <span className="text-red-500">*</span>
              </div>
              <input
                id="lastName"
                placeholder={user.lastname || ""}
                required
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Телефон
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+380 (__) ___ __ __"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Населений пункт
              </label>
              <input
                id="city"
                placeholder="Dnipro"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Save */}
            <div className="md:col-span-2 mt-2 flex justify-end">
              <button
                type="button"
                className="cursor-pointer inline-flex items-center justify-center rounded-xl bg-blue-700 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800 active:scale-[0.99] dark:bg-gray-700 dark:hover:bg-gray-600"
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
