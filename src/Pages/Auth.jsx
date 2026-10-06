import { useEffect, useRef, useState } from 'react'
import { Link, useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useDispatch } from 'react-redux'
import { sendUserRegister, sendUserLogin, sendGoogleLogin, sendActivationResend } from '../sending-data.js'
import { getMe } from '../fetching-data.js'
import Navbar from '../Components/NavBar'
import AuthLayout from '../Components/AuthLayout'
import AuthError from '../Components/AuthError'
import { authErrorMessage, isEmailAlreadyRegistered, requiredAuthFieldMessage } from '../utils/authErrors.js'
import { login } from '../State/authSlice.js'
import { GOOGLE_OAUTH_CLIENT_ID } from '../../dev_data.js'

const primaryButton = 'inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-wait disabled:opacity-60'
const secondaryButton = 'inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-wait disabled:opacity-60'

export default function Auth() {
  const isRegister = useLoaderData() === 1
  useEffect(() => { window.scrollTo(0, 0) }, [isRegister])

  return (
    <>
      <Navbar />
      <AuthForm key={isRegister ? 'register' : 'login'} isRegister={isRegister} />
    </>
  )
}

function AuthForm({ isRegister }) {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [input, setInput] = useState({})
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const [canResendVerification, setCanResendVerification] = useState(false)
  const [resent, setResent] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setInput(previous => ({ ...previous, [name]: value }))
  }

  function finishLogin(user) {
    dispatch(login(user))
    const destination = location.state?.returnTo
    navigate(!isRegister && typeof destination === 'string' && destination.startsWith('/') && !destination.startsWith('//') ? destination : '/')
  }

  async function submit(event) {
    event.preventDefault()
    if (pending) return
    setError('')
    setCanResendVerification(false)
    const invalidField = Array.from(event.currentTarget.elements).find(field => field.willValidate && !field.validity.valid)
    if (invalidField) {
      setError(invalidField.validity.valueMissing
        ? requiredAuthFieldMessage(invalidField.name, isRegister ? 'register' : 'login')
        : 'Перевірте email, наприклад name@example.com.')
      invalidField.focus()
      return
    }
    if (isRegister && input.password !== input.re_password) {
      setError('Паролі не збігаються.')
      event.currentTarget.elements.re_password.focus()
      return
    }
    setPending(true)
    try {
      const response = isRegister
        ? await sendUserRegister(input)
        : await sendUserLogin({ username: input.username, password: input.password })
      if (!response || response.error) {
        setError(authErrorMessage(response, isRegister ? 'register' : 'login'))
        setCanResendVerification(isRegister && isEmailAlreadyRegistered(response))
        return
      }
      if (isRegister) {
        setVerificationEmail(input.email)
      } else {
        finishLogin({ username: input.username })
      }
    } catch {
      setError(authErrorMessage({ code: 'network_error' }))
    } finally {
      setPending(false)
    }
  }

  async function resendVerificationEmail() {
    if (pending) return
    const email = verificationEmail || input.email
    if (!email) {
      setError('Спочатку введіть email.')
      return
    }
    setError('')
    setPending(true)
    try {
      const response = await sendActivationResend(email)
      if (response.error) {
        setError(authErrorMessage(response, 'resend'))
        return
      }
      setVerificationEmail(email)
      setCanResendVerification(false)
      setResent(true)
    } catch {
      setError(authErrorMessage({ code: 'network_error' }))
    } finally {
      setPending(false)
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    if (pending) return
    setError('')
    if (!credentialResponse?.credential) {
      setError(authErrorMessage(null, 'google'))
      return
    }
    setPending(true)
    try {
      const response = await sendGoogleLogin(credentialResponse.credential)
      if (!response || response.error) {
        setError(authErrorMessage(response, 'google'))
        return
      }
      const user = await getMe()
      if (!user) {
        setError('Повторіть вхід, будь ласка.')
        return
      }
      finishLogin(user)
    } catch {
      setError(authErrorMessage({ code: 'network_error' }))
    } finally {
      setPending(false)
    }
  }

  if (verificationEmail) {
    return (
      <AuthLayout title="Перевірте вашу пошту" description="Залишився один крок — підтвердити email.">
        <div className="space-y-5 text-sm leading-6">
          <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
            {resent ? 'Ми повторно надіслали лист на' : 'Ми надіслали посилання для підтвердження на'}
            <strong className="mt-1 block break-all">{verificationEmail}</strong>
          </div>
          <p className="text-gray-600">Відкрийте лист і натисніть посилання — це можна зробити прямо з телефона. Якщо листа немає, перевірте папку «Спам».</p>
          <p className="rounded-xl bg-blue-50 p-4 text-blue-900">Після підтвердження увійдіть у свій акаунт з ноутбука чи комп’ютера, щоб почати навчання.</p>
          <AuthError message={error} />
          <button type="button" disabled={pending} onClick={resendVerificationEmail} className={secondaryButton}>{pending ? 'Надсилаємо…' : 'Надіслати лист повторно'}</button>
          <Link to="/auth/0" className={primaryButton}>Перейти до входу</Link>
          <Link to="/" className="block py-2 text-center font-medium text-blue-700 hover:underline">На головну</Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={isRegister ? 'Зареєструватися' : 'Раді бачити вас знову'}
      description={isRegister ? 'Вітаємо на CourseForge! Створіть акаунт та підтвердіть ваш email' : 'Увійдіть у свій акаунт CourseForge.'}>
      <form onSubmit={submit} noValidate className="space-y-5" aria-busy={pending} aria-describedby={error ? 'auth-error' : undefined}>
        <fieldset disabled={pending} className="min-w-0 space-y-4">
          <AuthField name="username" label={isRegister ? 'Ім’я користувача' : 'Email або ім’я користувача'} autoComplete="username" input={input} onChange={handleChange} />
          {isRegister && <AuthField name="email" label="Email" type="email" autoComplete="email" input={input} onChange={handleChange} />}
          <AuthField name="password" label="Пароль" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} input={input} onChange={handleChange} />
          {isRegister && <AuthField name="re_password" label="Повторіть пароль" type="password" autoComplete="new-password" input={input} onChange={handleChange} />}
        </fieldset>
        <AuthError message={error} />
        {canResendVerification && <button type="button" disabled={pending} onClick={resendVerificationEmail} className={secondaryButton}>Надіслати лист підтвердження повторно</button>}
        <button type="submit" disabled={pending} className={primaryButton}>{pending ? 'Зачекайте…' : isRegister ? 'Створити акаунт' : 'Увійти'}</button>
        <GoogleAuthOption onSuccess={handleGoogleSuccess} onError={() => setError(authErrorMessage(null, 'google'))} />
        <p className="text-center text-sm leading-6 text-gray-600">
          {isRegister ? 'Вже маєте акаунт? ' : 'Ще не маєте акаунта? '}
          <Link to={isRegister ? '/auth/0' : '/auth/1'} state={location.state} className="inline-block py-1 font-semibold text-blue-700 hover:underline">{isRegister ? 'Увійти' : 'Зареєструватися'}</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

function AuthField({ name, label, type = 'text', autoComplete, input, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <input id={name} name={name} type={type} autoComplete={autoComplete} autoCapitalize="none" spellCheck={false}
        value={input[name] || ''} onChange={onChange} required
        className="block min-h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
    </div>
  )
}

function GoogleAuthOption({ onSuccess, onError }) {
  const container = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!container.current) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(Math.min(entry.contentRect.width, 400))))
    observer.observe(container.current)
    return () => observer.disconnect()
  }, [])

  if (!GOOGLE_OAUTH_CLIENT_ID) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">або</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
      <div ref={container} className="flex min-h-11 w-full min-w-0 justify-center">
        {width > 0 && <GoogleLogin onSuccess={onSuccess} onError={onError} useOneTap={false} theme="outline" size="large" width={String(width)} />}
      </div>
    </div>
  )
}
