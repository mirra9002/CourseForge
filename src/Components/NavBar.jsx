import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import course_forge_test_logo from '../assets/course-forge-test-logo.png'
import icon_user_black100 from '../assets/icon_user_black100.png'
import icon_mycourses_black100 from '../assets/icon_mycourses_black100.png'
import icon_logout_black100 from '../assets/icon_logout_black100.png'
import { logout } from '../State/authSlice.js'
import { LogOut } from '../sending-data.js'

export default function Navbar() {
  const { user, status } = useSelector(s => s.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isAuthed = status === 'authed' && user
  const userInitials = user?.username?.slice(0, 2).toUpperCase()

  function closeMenus() {
    setProfileMenuOpen(false)
    setMobileMenuOpen(false)
  }

  async function logOutUser() {
    await LogOut()
    dispatch(logout())
    closeMenus()
    navigate('/')
  }

  return (
    <>
      <nav aria-label="Головна навігація" className="fixed top-0 start-0 z-20 w-full border-b border-gray-200 bg-white">
        <div className="mx-auto flex min-h-18 max-w-screen-xl flex-wrap items-center justify-between gap-x-2 px-3 py-3 sm:px-6">
          <Link to="/" onClick={closeMenus} className="flex shrink-0 items-center gap-2">
            <img src={course_forge_test_logo} className="h-7 w-7 object-contain sm:h-8 sm:w-8" alt="" />
            <span className="text-base font-semibold text-gray-900 sm:text-2xl">CourseForge</span>
          </Link>

          <div className="flex items-center gap-2 lg:order-2">
            {isAuthed ? (
              <div className="relative">
                <button type="button" onClick={() => { setProfileMenuOpen(open => !open); setMobileMenuOpen(false) }}
                  aria-label="Меню профілю" aria-expanded={profileMenuOpen} aria-controls="user-dropdown"
                  className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-blue-600">
                  {userInitials}
                </button>
                {profileMenuOpen && (
                  <div id="user-dropdown" className="absolute right-0 top-full mt-2 w-60 max-w-[calc(100vw-2rem)] divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white shadow-lg">
                    <div className="px-4 py-3 text-sm text-gray-900">
                      <div className="truncate font-semibold">{user.username}</div>
                      <div className="truncate text-gray-500">{user.email}</div>
                    </div>
                    <div className="py-1 text-sm text-gray-700">
                      <Link to="/me" onClick={closeMenus} className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100"><img src={icon_user_black100} className="h-4" alt="" />Профіль</Link>
                      <Link to="/mycourses" onClick={closeMenus} className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100"><img src={icon_mycourses_black100} className="h-4" alt="" />Мої курси</Link>
                    </div>
                    <button type="button" onClick={logOutUser} className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"><img src={icon_logout_black100} className="h-4" alt="" />Вийти</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth/1" onClick={closeMenus} className="inline-flex min-h-11 items-center rounded-full bg-blue-700 px-3 text-xs font-medium text-white hover:bg-blue-800 focus-visible:ring-4 focus-visible:ring-blue-300 sm:px-5 sm:text-sm">
                <span className="sm:hidden">Реєстрація</span><span className="hidden sm:inline">Зареєструватися</span>
              </Link>
            )}
            <button type="button" onClick={() => { setMobileMenuOpen(open => !open); setProfileMenuOpen(false) }}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-600 lg:hidden"
              aria-controls="navbar-menu" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Закрити меню' : 'Відкрити меню'}>
              <svg className="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d={mobileMenuOpen ? 'M6 6l12 12M6 18L18 6' : 'M3 6h18M3 12h18M3 18h18'} />
              </svg>
            </button>
          </div>

          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} w-full lg:order-1 lg:block lg:w-auto`} id="navbar-menu">
            <ul className="mt-3 flex flex-col gap-1 rounded-xl bg-gray-50 p-2 font-medium lg:mt-0 lg:flex-row lg:gap-6 lg:bg-white lg:p-0">
              {[['/', 'Головна'], ['/search', 'Курси'], ['/certificate', 'Сертифікати'], ...(!isAuthed ? [['/auth/0', 'Увійти']] : [])].map(([to, label]) => (
                <li key={to}>
                  <NavLink to={to} end onClick={closeMenus} className={({ isActive }) => `block rounded-lg px-3 py-3 text-sm lg:px-0 ${isActive ? 'bg-blue-50 text-blue-700 lg:bg-transparent' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700 lg:hover:bg-transparent'}`}>{label}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
      <div className="h-18" aria-hidden="true" />
    </>
  )
}
