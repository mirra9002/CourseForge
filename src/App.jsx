import { startTransition, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useLocation, useRevalidator } from "react-router-dom"
import {login, logout} from './State/authSlice.js'
import { getMe } from "./fetching-data"
import { isMobileAccessiblePath, isMobileDevice } from './utils/deviceAccess.js'
import './App.css'

// Set default theme to light
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'light')
  document.documentElement.classList.remove('dark')
  document.documentElement.classList.add('light')
}
function DeviceNotice({ title, description, titleId, children }) {
  return (
    <main className="mobile-device-notice">
      <section className="mobile-device-notice__panel" aria-labelledby={titleId}>
        <img
          className="mobile-device-notice__logo"
          src="/course-forge-test-logo.png"
          alt="CourseForge"
        />
        <p className="mobile-device-notice__eyebrow">CourseForge</p>
        <h1 id={titleId}>{title}</h1>
        <p>{description}</p>
        {children}
      </section>
    </main>
  )
}

function MobileOnlyNotice() {
  return (
    <DeviceNotice
      titleId="mobile-device-title"
      title="Відкрийте платформу з ноутбука чи комп'ютера"
      description="Курси та інші розділи платформи доступні з комп'ютера. З телефона ви можете зареєструватися, увійти та підтвердити email."
    >
      <div className="mt-6 flex flex-col gap-3">
        <Link to="/auth/1" className="rounded-lg bg-blue-700 px-4 py-3 font-medium text-white hover:bg-blue-800">Зареєструватися</Link>
        <Link to="/auth/0" className="rounded-lg border border-gray-200 px-4 py-3 font-medium text-blue-700 hover:bg-blue-50">Увійти</Link>
        <Link to="/" className="py-2 text-sm font-medium text-blue-700 hover:underline">На головну</Link>
      </div>
    </DeviceNotice>
  )
}

function App({children}) {
  const [isMobile, setIsMobile] = useState(isMobileDevice)
  const [isRestoringDesktop, setIsRestoringDesktop] = useState(false)
  const { pathname } = useLocation()
  const { revalidate } = useRevalidator()
  const dispatch = useDispatch()

  useEffect(() => {
    let previousMobile = isMobileDevice()
    function updateEnvironmentState() {
      const mobile = isMobileDevice()
      if (previousMobile && !mobile && !isMobileAccessiblePath(pathname)) {
        // Wait for data skipped by the device guard before rendering desktop pages.
        setIsRestoringDesktop(true)
        revalidate().finally(() => {
          // Commit with the router's transition so children see the reloaded data.
          startTransition(() => setIsRestoringDesktop(false))
        })
      }
      previousMobile = mobile
      setIsMobile(mobile)
    }

    window.addEventListener('resize', updateEnvironmentState)
    window.addEventListener('orientationchange', updateEnvironmentState)

    return () => {
      window.removeEventListener('resize', updateEnvironmentState)
      window.removeEventListener('orientationchange', updateEnvironmentState)
    }
  }, [pathname, revalidate])

  useEffect(() => {
    let active = true

    async function getUser() {
      const me = await getMe().catch(() => null)
      if (!active) return
      if(!me){
        dispatch(logout())
        return
      }
      dispatch(login(me))
    }
    getUser()
    return () => { active = false }
  }, [dispatch]);

  if (isMobile && !isMobileAccessiblePath(pathname)) {
    return <MobileOnlyNotice />
  }

  if (isRestoringDesktop) {
    return <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6" role="status">Завантажуємо сторінку…</main>
  }

  return children
}

export default App
