import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import {login, logout} from './State/authSlice.js'
import { getMe } from "./fetching-data"
import './App.css'

// Set default theme to light
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'light')
  document.documentElement.classList.remove('dark')
  document.documentElement.classList.add('light')
}
function isMobileDevice() {
  if (typeof window === 'undefined') {
    return false
  }

  const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  )
  const smallViewport = window.matchMedia('(max-width: 900px)').matches
  const touchTablet = window.matchMedia('(pointer: coarse) and (max-width: 1180px)').matches

  return mobileUserAgent || smallViewport || touchTablet
}

function DeviceNotice({ title, description, titleId }) {
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
      </section>
    </main>
  )
}

function MobileOnlyNotice() {
  return (
    <DeviceNotice
      titleId="mobile-device-title"
      title="Відкрийте платформу з ноутбука чи комп'ютера"
      description="Наразі мобільна версія тимчасово недоступна. Щоб авторизація та уроки працювали стабільно, зайдіть, будь ласка, із desktop-пристрою."
    />
  )
}

function App({children}) {
  const [isMobile, setIsMobile] = useState(isMobileDevice)
  const dispatch = useDispatch()

  useEffect(() => {
    function updateEnvironmentState() {
      setIsMobile(isMobileDevice())
    }

    window.addEventListener('resize', updateEnvironmentState)
    window.addEventListener('orientationchange', updateEnvironmentState)

    return () => {
      window.removeEventListener('resize', updateEnvironmentState)
      window.removeEventListener('orientationchange', updateEnvironmentState)
    }
  }, [])

  useEffect(() => {
    if (isMobile) {
      return
    }

    async function getUser() {
      const me = await getMe()
      if(!me){
        dispatch(logout())
        return
      }
      const user = {username: me.username, status: 'authed'}
      //console.log('IS AUTHED', me);
      dispatch(login(user))
    }
    getUser()
  }, [dispatch, isMobile]);

  if (isMobile) {
    return <MobileOnlyNotice />
  }

  return children
}

export default App
